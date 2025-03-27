use sea_orm::FromJsonQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, ts_rs::TS, FromJsonQueryResult)]
#[ts(export)]
pub struct Civitai {
    series: String,
    version: String,
    trigger: Vec<String>,
}
