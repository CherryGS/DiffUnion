use sea_orm::{DatabaseConnection, DbErr};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    fs::create_dir_all,
    path::PathBuf,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
};
use ts_rs::TS;

/** 数据库链接管理 */
pub struct PoolManager {
    pools: Arc<Mutex<HashMap<String, DatabaseConnection>>>,
    closed: Arc<AtomicBool>,
}

pub struct AppState {
    pub global: GlobalConfig,
    pub conn: PoolManager,
}

impl PoolManager {
    pub fn new() -> Self {
        Self {
            pools: Arc::new(Mutex::new(HashMap::new())),
            closed: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn add(&self, name: String, pool: DatabaseConnection) -> Result<(), String> {
        if self.closed.load(Ordering::SeqCst) {
            return Err("PoolManager is shutting down, cannot add pool.".to_string());
        }
        let mut inner = self.pools.lock().unwrap();
        inner.insert(name, pool);
        Ok(())
    }

    pub fn get(&self, name: &String) -> Option<DatabaseConnection> {
        let inner = self.pools.lock().unwrap();
        inner.get(name).cloned()
    }

    pub async fn close(&self) -> Result<(), DbErr> {
        self.closed.store(true, Ordering::SeqCst);
        let mut inner = self.pools.lock().unwrap();
        for (_, pool) in inner.drain() {
            pool.close().await?;
        }
        Ok(())
    }
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
