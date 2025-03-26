use sea_orm::{Database, DatabaseConnection};

async fn init_db(pool: &DatabaseConnection) -> Result<(), sqlx::Error> {
    const CREATE_TABLE: &str = r#"CREATE TABLE IF NOT EXISTS main (
      pk	INTEGER,
      name	TEXT NOT NULL UNIQUE,
      fa	INTEGER DEFAULT 0,
      PRIMARY KEY(pk AUTOINCREMENT)
      );"#;
    sqlx::query(CREATE_TABLE).execute(pool).await?;

    Ok(())
}

async fn add(pool: &SqlitePool, data: &Vec<String>) -> Result<(), sqlx::Error> {
    let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("INSERT INTO main (name)");

    qb.push_values(data.iter().take(512), |mut q, d| {
        q.push_bind(d);
    });

    let query = qb.build();
    query.execute(pool).await?;

    Ok(())
}
