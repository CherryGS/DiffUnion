pub mod command;
pub mod utils;
use command::*;
use std::{path::PathBuf, sync::OnceLock};
use tauri::Manager;

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
            cmd_find_files_by_ext,
            cmd_read_text,
            cmd_write_text,
            cmd_use_regex
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
