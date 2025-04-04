pub use sea_orm_migration::prelude::*;

pub struct Migrator;

mod m20250327_120719_create_table;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20250327_120719_create_table::Migration)]
    }
}
