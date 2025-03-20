pub mod command;
pub mod config;
pub mod utils;
use command::*;
use config::{AppState, AppStrucDir};
use std::path::PathBuf;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            cmd_find_files_by_ext,
            cmd_read_text,
            cmd_write_text,
            cmd_use_regex,
            cmd_get_struc
        ])
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().unwrap();
            app.manage(AppState::new(AppStrucDir::new(
                if let Ok(datafolder) = std::fs::read_to_string(app_data_dir.join("dataFolder.txt"))
                {
                    PathBuf::from(datafolder)
                } else {
                    app_data_dir.clone()
                },
            )));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
