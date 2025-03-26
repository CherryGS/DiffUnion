use crate::entity::model::{main, prelude::*};
use sea_orm::{
    ColumnTrait, ConnectOptions, ConnectionTrait, Database, DatabaseConnection, DbErr, EntityName,
    EntityTrait, QueryFilter, Schema, Statement,
};
use tracing::instrument;

async fn table_exists(db: &DatabaseConnection, table_name: &str) -> Result<bool, DbErr> {
    let stmt = Statement::from_sql_and_values(
        db.get_database_backend(),
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        vec![table_name.into()],
    );
    let res = db.query_one(stmt).await?;
    Ok(res.is_some())
}

#[instrument]
pub async fn init_db(url: String) -> Result<DatabaseConnection, DbErr> {
    let db = Database::connect(ConnectOptions::new(url)).await?;
    db.execute_unprepared("PRAGMA journal_mode=WAL").await?;

    if table_exists(&db, main::Entity::table_name(&self)).await? == false {}
    let builder = db.get_database_backend();
    let schema = Schema::new(builder);

    db.execute(builder.build(&schema.create_table_from_entity(Main)))
        .await?;
    for i in &schema.create_index_from_entity(main::Entity) {
        db.execute(builder.build(i)).await?;
    }

    Ok(db)
}

#[instrument]
pub async fn add(db: &DatabaseConnection, data: Vec<main::ActiveModel>) -> Result<(), DbErr> {
    Main::insert_many(data).exec(db).await?;
    Ok(())
}

#[instrument]
pub async fn del(db: &DatabaseConnection, blake3: Vec<u8>) -> Result<(), DbErr> {
    Main::delete_many()
        .filter(main::Column::Blake3.eq(blake3))
        .exec(db)
        .await?;
    Ok(())
}
