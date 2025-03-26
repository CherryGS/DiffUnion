use sea_orm::DatabaseConnection;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs::create_dir_all, io::Error, path::PathBuf};
use ts_rs::TS;

pub struct AppState {
    pub global: GlobalConfig,
    pub conn: ConnectionCache,
}

/** 缓存数据库链接，其中 */
type ConnectionCache = HashMap<String, DatabaseConnection>;

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
    pub base: PathBuf,
    /** 备份目录 */
    pub backup: PathBuf,
    /** 配置文件目录 */
    pub config: PathBuf,
    /** 数据库目录 */
    pub database: PathBuf,
    /** 媒体库目录 */
    pub media: PathBuf,
    /** 模型库目录 */
    pub model: PathBuf,
    /** 缩略图目录 */
    pub thumbnail: PathBuf,
}

impl AppStrucDir {
    pub fn new(base: PathBuf) -> Result<AppStrucDir, std::io::Error> {
        let p = AppStrucDir {
            backup: base.join("Backup"),
            config: base.join("Config"),
            database: base.join("Database"),
            media: base.join("Media"),
            model: base.join("Model"),
            thumbnail: base.join("Thumbnail"),
            base,
        };
        Self::create_folder(&p)?;
        Ok(p)
    }
    pub fn create_folder(&self) -> Result<(), std::io::Error> {
        for i in vec![
            &self.base,
            &self.backup,
            &self.config,
            &self.database,
            &self.media,
            &self.model,
            &self.thumbnail,
        ]
        .into_iter()
        {
            create_dir_all(i)?;
        }
        Ok(())
    }
}
