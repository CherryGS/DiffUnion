use std::{collections::HashSet, fs::write, path::PathBuf, sync::OnceLock};
use tauri::Manager;
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
        .invoke_handler(tauri::generate_handler![
            find_files_by_ext,
            get_datafolder,
            set_datafolder,
            get_global_config,
            set_global_config,
            read_text,
            write_text
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
 * 硬编码获取用户自定义数据目录
 */
#[tauri::command()]
fn get_datafolder() -> Result<PathBuf, PathBuf> {
    let file = APP_DATA_DIR.get().unwrap().join("dataFolder.txt");
    //当文件不存在时，创建
    if file.is_file() == false {
        write(&file, APP_DATA_DIR.get().unwrap().to_str().unwrap()).unwrap();
    }

    let data_folder = PathBuf::from(std::fs::read_to_string(file).unwrap());
    if data_folder.is_dir() == false {
        Err(data_folder)
    } else {
        Ok(data_folder)
    }
}

/**
 * 硬编码修改用户自定义数据目录
 */
#[tauri::command()]
fn set_datafolder(v: &str) {
    let path = APP_DATA_DIR.get().unwrap().join("dataFolder.txt");
    write(&path, v).unwrap();
}

/**
 * 硬编码获取全局配置文件
 */
#[tauri::command()]
fn get_global_config() -> String {
    let file = get_datafolder().unwrap().join("config.json");
    //当文件不存在时，创建
    if file.is_file() == false {
        write(&file, "{}").unwrap();
    }
    std::fs::read_to_string(file).unwrap()
}

/**
 * 硬编码储存全局配置文件，
 */
#[tauri::command]
fn set_global_config(v: &str) {
    let file = get_datafolder().unwrap().join("config.json");
    std::fs::write(file, v).unwrap()
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
