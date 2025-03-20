use std::{clone, collections::HashSet, path::PathBuf};

use tauri::{AppHandle, Manager, State};
use walkdir::WalkDir;

use crate::{
    config::{AppState, AppStrucDir},
    utils::use_regex,
};

/**
根据给定路径数组递归获取所有路径下扩展名符合的文件，默认按时间降序排列，走符号链接，当出现循环时行为未知
*/
#[tauri::command()]
pub fn cmd_find_files_by_ext(paths: Vec<&str>, exts: Vec<&str>) -> Vec<PathBuf> {
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
pub fn cmd_read_text(file: PathBuf) -> Result<String, String> {
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
#[tauri::command]
pub fn cmd_write_text(file: PathBuf, cont: String) -> Result<(), String> {
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
pub fn cmd_use_regex(src: Vec<&str>, patts: Vec<String>) -> Vec<Vec<Option<&str>>> {
    use_regex(src, patts)
}

#[tauri::command]
pub fn cmd_get_struc(state: State<'_, AppState>) -> AppStrucDir {
    state.struc.clone()
}
