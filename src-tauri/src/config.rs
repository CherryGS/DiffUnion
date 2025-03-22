use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub struct AppState {
    pub global: GlobalConfig,
}

/** 前后端共享的配置的结构 */
#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export)]
pub struct GlobalConfig {
    pub struc: AppStrucDir,
}

impl GlobalConfig {
    pub fn new(struc: AppStrucDir) -> Self {
        GlobalConfig { struc }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
pub struct AppStrucDir {
    /** 结构的根目录 */
    base: PathBuf,
    /** 备份目录 */
    backup: PathBuf,
    /** 配置文件目录 */
    config: PathBuf,
    /** 数据库目录 */
    database: PathBuf,
    /** 媒体库目录 */
    media: PathBuf,
    /** 模型库目录 */
    model: PathBuf,
    /** 缩略图目录 */
    thumbnail: PathBuf,
}

impl AppStrucDir {
    pub fn new(base: PathBuf) -> AppStrucDir {
        AppStrucDir {
            backup: base.join("Backup"),
            config: base.join("Config"),
            database: base.join("Database"),
            media: base.join("Media"),
            model: base.join("Model"),
            thumbnail: base.join("Thumbnail"),
            base,
        }
    }
}
