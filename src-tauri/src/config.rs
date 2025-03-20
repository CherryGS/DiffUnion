use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub struct AppState {
    pub struc: AppStrucDir,
}

impl AppState {
    pub fn new(struc: AppStrucDir) -> Self {
        AppState { struc }
    }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export)]
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
            backup: base.join("backup"),
            config: base.join("config"),
            database: base.join("database"),
            media: base.join("media"),
            model: base.join("model"),
            thumbnail: base.join("thumbnail"),
            base,
        }
    }
}
