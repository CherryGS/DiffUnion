pub mod model;
// mod tag;

#[cfg(test)]
mod test_create {
    use std::{fs::canonicalize, path::PathBuf};

    use migration_model::MigratorTrait;

    use crate::database;

    #[tokio::test]
    async fn create_db() {
        let base = canonicalize(PathBuf::from(r"../../../db/")).unwrap();
        let url = format!(
            "sqlite://{}",
            base.join("model.db?mode=rwc").to_str().unwrap()
        );
        dbg!(&url);
        let db = database::model::init_db(url).await.unwrap();
        migration_model::Migrator::up(&db, None).await.unwrap();
    }
}
