use crate::entity::model::{main, prelude::*};
use migration_model::{Migrator, MigratorTrait};
use sea_orm::{
    ColumnTrait, ConnectionTrait, Database, DatabaseConnection, DbErr, EntityTrait, QueryFilter,
};
use tracing::instrument;

#[instrument(level = "trace")]
pub async fn init_db(url: String) -> Result<DatabaseConnection, DbErr> {
    let db = Database::connect(url).await?;
    db.execute_unprepared("PRAGMA journal_mode=WAL").await?;
    db.execute_unprepared("PRAGMA synchronous=NORMAL").await?;
    Migrator::up(&db, None).await?;
    Ok(db)
}

#[instrument(level = "trace")]
pub async fn add(db: &DatabaseConnection, data: Vec<main::ActiveModel>) -> Result<(), DbErr> {
    Main::insert_many(data).exec(db).await?;
    Ok(())
}

#[instrument(level = "trace")]
pub async fn del(db: &DatabaseConnection, blake3: Vec<u8>) -> Result<(), DbErr> {
    Main::delete_many()
        .filter(main::Column::Blake3.eq(blake3))
        .exec(db)
        .await?;
    Ok(())
}
