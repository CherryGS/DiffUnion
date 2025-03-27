use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Main::Table)
                    .if_not_exists()
                    .col(pk_auto(Main::Pk))
                    .col(blob_uniq(Main::Blake3))
                    .col(string(Main::Path))
                    .col(blob(Main::Sha256))
                    .col(string_null(Main::Name))
                    .col(string_null(Main::Tags))
                    .col(string_null(Main::StaticTags))
                    .col(string_null(Main::Note))
                    .col(big_unsigned(Main::CreateTime))
                    .col(big_unsigned(Main::UpdateTime))
                    .col(json_null(Main::Civitai))
                    .to_owned(),
            )
            .await?;
        manager
            .create_index(
                sea_query::Index::create()
                    .name("idx_blake3")
                    .table(Main::Table)
                    .col(Main::Blake3)
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Main::Table).to_owned())
            .await?;
        manager
            .drop_index(
                sea_query::Index::drop()
                    .name("idx_blake3")
                    .table(Main::Table)
                    .to_owned(),
            )
            .await?;
        Ok(())
    }
}

#[derive(DeriveIden)]
enum Main {
    Table,
    Pk,
    Blake3,
    Path,
    Sha256,
    Name,
    Tags,
    StaticTags,
    Note,
    CreateTime,
    UpdateTime,
    Civitai,
}
