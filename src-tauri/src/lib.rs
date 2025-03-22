pub mod command;
pub mod config;
pub mod utils;
use command::*;
use config::{AppState, AppStrucDir, GlobalConfig};
use std::path::PathBuf;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            cmd_find_files_by_ext,
            cmd_read_text,
            cmd_write_text,
            cmd_use_regex,
            cmd_get_global
        ])
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().unwrap();
            app.manage(AppState {
                global: GlobalConfig::new(AppStrucDir::new(
                    if let Ok(datafolder) =
                        std::fs::read_to_string(app_data_dir.join("dataFolder.txt"))
                    {
                        PathBuf::from(datafolder)
                    } else {
                        app_data_dir.clone()
                    },
                )),
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
