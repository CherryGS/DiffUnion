use entity::model::main;
use sea_orm::ActiveValue::{NotSet, Set};
use sha2::{Digest, Sha256};
use std::path::PathBuf;

use crate::{database, utils::time_now};
use tauri::State;

use crate::config::AppState;

#[tauri::command]
pub async fn cmd_add_one_model(state: State<'_, AppState>, input: PathBuf) -> Result<(), String> {
    let db = state.conn.get(&"model".to_string()).unwrap();

    let data = std::fs::read(&input).unwrap();
    let mut s = Sha256::new();
    s.update(&data);
    let data = main::ActiveModel {
        pk: NotSet,
        blake3: Set(blake3::hash(&data).as_bytes().into()),
        path: Set(input.to_str().unwrap().to_string()),
        sha256: Set(s.finalize()[..].into()),
        tags: NotSet,
        note: NotSet,
        name: Set(input.file_name().map(|d| d.to_str().unwrap().to_string())),
        create_time: Set(time_now() as i64),
        update_time: Set(time_now() as i64),
        static_tags: NotSet,
        civitai: NotSet,
    };

    database::model::add(&db, vec![data])
        .await
        .map_err(|e| format!("{:?}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn cmd_update_model_civitai(blake3: String) {}
