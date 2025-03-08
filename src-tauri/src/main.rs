// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::ImageReader;
use serde_json::Value;
use std::path::Path;
use std::process::Command;
use std::{error::Error, iter::zip};

fn _extract_metadata(img_path: &Path, exif_path: &Path) -> Result<Value, Box<dyn Error>> {
    // 1. 构建命令行
    let output = Command::new(exif_path)
        .arg(img_path)
        .arg("-j") // 使用 -j 参数让 exif 输出 JSON 格式
        .output()?;
    // 2. 检查命令是否成功执行
    if !output.status.success() {
        let err_msg = String::from_utf8_lossy(&output.stderr);
        return Err(format!("exif 命令执行失败: {}", err_msg).into());
    }
    // 3. 将输出转换为 JSON
    let json_string = String::from_utf8(output.stdout)?;
    let json_data: Value = serde_json::from_str(&json_string)?;
    Ok(json_data)
}

fn _create_thumbnail(img_path: &Path, thumb_path: &Path) -> Result<(), Box<dyn Error>> {
    /*
    目前只是简单的进行了格式转换，没有进行缩放操作。
    通过将 png 的后缀名改为 jpg 的后缀名，可以将 png 图片转换为 jpg 格式。
    */
    let img = ImageReader::open(img_path)?.decode()?;
    img.save(thumb_path)?;
    Ok(())
}

fn _hash_images(img_paths: &Vec<&Path>) -> Result<Vec<String>, Box<dyn Error>> {
    let mut res: Vec<String> = Vec::new();
    for img_path in img_paths {
        let img = std::fs::read(img_path)?;
        let hash = blake3::hash(&img);
        res.push(hash.to_string());
    }
    Ok(res)
}

fn _extract_parameters(metadata: &Value) {
    let _mapping = [
        ("Steps", r"(?<=Steps:).+?}(?=,)"),
        ("Sampler", r"(?<=Sampler:).+?}(?=,)"),
        ("CFG", r"(?<=CFG scale:).+?}(?=,)"),
        ("Seed", r"(?<=Seed:).+?}(?=,)"),
        ("Size", r"(?<=Size:).+?}(?=,)"),
        ("ClipSkip", r"(?<=Clip skip:).+?}(?=,)"),
        ("ModelHash", r"(?<=Model hash:).+?}(?=,)"),
        ("Model", r"(?<=Model:).+?}(?=,)"),
        ("Positive", r"^.+?(?=Negative prompt)/gs"),
        (
            "Negative",
            r"(?<=Negative prompt:).+?(?=^[A-Z]+[a-z ]+:)\gms",
        ),
        ("Hashes", r"(?<=Hashes:).+?}(?=,)"),
    ];

    let _param = &metadata["Parameters"].as_str().unwrap();
}

fn _processing_images(
    img_paths: &Vec<&Path>,
    exif_path: &Path,
    thumb_folder: &Path,
) -> Result<(), Box<dyn Error>> {
    let hash_list = _hash_images(img_paths)?;
    for (hash, img_path) in zip(hash_list, img_paths) {
        let thumb_path = thumb_folder.join(format!("{}.json", hash));
        _create_thumbnail(img_path, &thumb_path)?;

        let _metadata = _extract_metadata(img_path, exif_path)?;
    }

    Ok(())
}

// fn _test() -> Result<(), Box<dyn Error>> {
//     let img_path = Path::new(r"E:\Project\DiffUnion\src-tauri\src\1.png");
//     let thumb_path = Path::new(r"E:\Project\DiffUnion\src-tauri\src\11.png");
//     create_thumbnail(img_path, thumb_path)?;
//     Ok(())
// }

fn main() {
    diffunion_lib::run();
}
