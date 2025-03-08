use std::{collections::HashSet, path::PathBuf};
use walkdir::WalkDir;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![find_files_by_ext])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command()]
fn find_files_by_ext(paths: Vec<&str>, exts: Vec<&str>) -> Vec<PathBuf> {
    let mut set = HashSet::new();
    for path in paths {
        for entry in WalkDir::new(path)
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
