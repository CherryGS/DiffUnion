use std::str::FromStr;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelHash {
    #[serde(rename = "AutoV1")]
    auto_v1: String,
    #[serde(rename = "AutoV2")]
    auto_v2: String,
    #[serde(rename = "AutoV3")]
    auto_v3: String,
    #[serde(rename = "SHA256")]
    sha256: String,
    #[serde(rename = "CRC32")]
    crc32: String,
    #[serde(rename = "BLAKE3")]
    blake3: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelFile {
    id: u32,
    #[serde(rename = "sizeKB")]
    size_kb: f64,
    name: String,
    #[serde(rename = "type")]
    _type: String,
    #[serde(rename = "downloadUrl")]
    download_url: String,
    hashes: ModelHash,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelImage {
    url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BaseModelType {
    Illustrious,
    NoobAI,
    Pony,
    #[serde(rename = "SDXL 1.0")]
    SDXL1_0,
    #[serde(rename = "SD 1.5")]
    SD1_5,
    #[serde(rename = "Flux.1 D")]
    Flux1D,
    #[serde(rename = "Wan Vedio")]
    WanVedio,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelVersion {
    id: u32,
    index: u32,
    name: String,
    #[serde(rename = "baseModel")]
    base_model: BaseModelType,
    description: Option<String>,
    #[serde(rename = "downloadUrl")]
    download_url: String,
    images: Vec<ModelImage>,
    files: Vec<ModelFile>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TensorType {
    Checkpoint,
    Embedding,
    Hypernetwork,
    Controlnet,
    #[serde(rename = "LORA")]
    Lora,
    Locon,
    #[serde(rename = "DoRA")]
    Dora,
    Upscaler,
    VAE,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelResponse {
    id: u32,
    name: String,
    description: String,
    #[serde(rename = "type")]
    _type: TensorType,
    #[serde(rename = "modelVersions")]
    model_versions: Vec<ModelVersion>,
}

#[cfg(test)]
mod tests_civitai_api {
    use crate::request::model::ModelResponse;

    #[tokio::test]
    async fn test_civitai_api_model_base() {
        let body = reqwest::get("https://civitai.com/api/v1/models/120774")
            .await
            .unwrap()
            .text()
            .await
            .unwrap();
        let u: ModelResponse = serde_json::from_str(body.as_str()).unwrap();
        dbg!(u);
    }
}
