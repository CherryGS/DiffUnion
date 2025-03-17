pub mod utils;

use std::{collections::HashSet, path::PathBuf, sync::OnceLock};
use tauri::Manager;
use tauri_plugin_shell::{process::CommandEvent, ShellExt};
use walkdir::WalkDir;

static APP_DATA_DIR: OnceLock<PathBuf> = OnceLock::new();

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            find_files_by_ext,
            read_text,
            write_text,
            extract_img_info
        ])
        .setup(|app| {
            // 初始化应用数据目录并保存
            std::fs::create_dir_all(
                APP_DATA_DIR.get_or_init(|| app.path().app_data_dir().unwrap()),
            )?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/**
根据给定路径数组递归获取所有路径下扩展名符合的文件，默认按时间降序排列，走符号链接，当出现循环时行为未知
*/
#[tauri::command()]
fn find_files_by_ext(paths: Vec<&str>, exts: Vec<&str>) -> Vec<PathBuf> {
    let mut set = HashSet::new();
    for path in paths {
        for entry in WalkDir::new(path)
            .follow_links(true)
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| e.file_type().is_file())
        {
            if let Some(ext) = entry.path().extension() {
                if exts.contains(&ext.to_str().unwrap()) {
                    set.insert((
                        entry.metadata().unwrap().created().unwrap(),
                        entry.into_path(),
                    ));
                }
            }
        }
    }

    let mut v: Vec<_> = set.into_iter().collect();
    v.sort_unstable_by(|x, y| y.0.cmp(&x.0));
    v.into_iter().map(|(_, p)| p).collect()
}

/**
 * 读取一个文本类型文件
 */
#[tauri::command()]
fn read_text(file: PathBuf) -> Result<String, String> {
    match std::fs::read_to_string(&file) {
        Ok(cont) => Ok(cont),
        Err(e) => Err(format!(
            "文本文件 {} 读取失败.\n {}",
            file.to_str().unwrap(),
            e
        )),
    }
}

/**
 * 写入一个文本类型文件
 */
#[tauri::command()]
fn write_text(file: PathBuf, cont: String) -> Result<(), String> {
    match std::fs::write(&file, &cont) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!(
            "写入文件 {} 失败.\n {}\n {}",
            file.to_str().unwrap(),
            cont,
            e
        )),
    }
}

#[tauri::command]
async fn extract_img_info(app: tauri::AppHandle, file: String) {
    let comm =
        app.shell()
            .sidecar("exif-tool")
            .unwrap()
            .args([file.as_str(), "-csv", "-Parameters"]);
    let (mut _rx, mut _child) = comm.spawn().unwrap();
    let mut res = String::new();
    let mut count = 0;
    while let Some(event) = _rx.recv().await {
        match event {
            CommandEvent::Stdout(output) => {
                // 通过去掉前两行来规避掉 csv 格式的头和第一行 SourceFile
                if count > 1 {
                    res.push_str(&String::from_utf8(output).unwrap());
                } else {
                    count = count + 1;
                }
            }
            CommandEvent::Stderr(output) => {
                println!("{:?}", String::from_utf8(output))
            }
            _ => {}
        }
    }
    println!("{}", res)
}
