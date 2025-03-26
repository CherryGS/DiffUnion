mod command;
mod config;
mod database;
mod entity;
mod utils;
use command::*;
use config::{AppState, AppStrucDir, GlobalConfig};
use std::{collections::HashMap, path::PathBuf};
use tauri::{async_runtime::block_on, Manager};

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
            let global = GlobalConfig::new(
                AppStrucDir::new(
                    if let Ok(datafolder) =
                        std::fs::read_to_string(app_data_dir.join("dataFolder.txt"))
                    {
                        PathBuf::from(datafolder)
                    } else {
                        app_data_dir.clone()
                    },
                )
                .unwrap(),
            );
            let mut conn = HashMap::new();
            let res = block_on(database::model::init_db(format!(
                "sqlite://{}",
                global
                    .struc
                    .database
                    .join("model.db?mode=rwc")
                    .to_str()
                    .unwrap()
            )))?;
            conn.insert("model".to_string(), res);

            app.manage(AppState { global, conn });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
