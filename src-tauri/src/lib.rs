mod command;
mod config;
mod database;
mod utils;
use command::*;
use config::{AppState, AppStrucDir, GlobalConfig, PoolManager};
use std::path::PathBuf;
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

            let manager = PoolManager::new();
            manager.add(
                "model".to_string(),
                block_on(database::model::init_db(format!(
                    "sqlite://{}",
                    global
                        .struc
                        .database
                        .join("model.db?mode=rwc")
                        .to_str()
                        .unwrap()
                )))?,
            )?;

            app.manage(AppState {
                global,
                conn: manager,
            });

            Ok(())
        })
        .on_window_event(|w, e| {
            // 当收到窗口关闭事件时
            if let tauri::WindowEvent::CloseRequested { .. } = e {
                // 关闭所有数据库连接
                block_on(w.app_handle().state::<AppState>().conn.close()).unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
