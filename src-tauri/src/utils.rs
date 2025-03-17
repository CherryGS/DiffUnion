/** 该文件不应包含 tauri 的内容 */
use rayon::prelude::*;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::{LazyLock, RwLock},
};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ImageInfo {
    positive: String,
    negative: String,
    sampler: String,
    scheduler: String,
    steps: u32,
    seed: u32,
    cfg: i32,
    model: String,
    loras: Vec<String>,
}

static REGEX_CACHE: LazyLock<RwLock<HashMap<String, Regex>>> =
    LazyLock::new(|| RwLock::new(HashMap::new()));

/**
对于给定的 `src` 中的每一项，分别使用 `patts` 中的每一项作为 regex pattern 进行匹配并获取第一个匹配结果。

通过全局 HashMap 缓存避免多次编译 pattern ，同时使用 rayon 库并以 `src` 为基本单位并行处理。
*/
pub fn use_regex(src: Vec<&str>, patts: Vec<String>) -> Vec<Vec<Option<&str>>> {
    let mut lock = REGEX_CACHE.write().unwrap();
    for patt in patts.iter() {
        if !lock.contains_key(patt.as_str()) {
            let re = Regex::new(patt.as_str()).unwrap();
            lock.insert(patt.clone(), re);
        }
    }
    drop(lock);
    let lock = REGEX_CACHE.read().unwrap();
    let compiled_patts: Vec<_> = patts.iter().map(|d| lock.get(d).unwrap()).collect();

    let res: Vec<Vec<_>> = src
        .par_iter()
        .map(|i| -> Vec<_> {
            compiled_patts
                .iter()
                .map(|j| {
                    if let Some(x) = j.find(i) {
                        Some(x.as_str())
                    } else {
                        None
                    }
                })
                .collect()
        })
        .collect();
    res
}

#[cfg(test)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;

    #[test]
    fn test_extract_by_regex() {
        let src = vec!["123abcABC", "你好"];
        let patts = vec![
            r"\d+".to_string(),
            r"[a-z]+".to_string(),
            r"[A-Z]+".to_string(),
            r"[\u4e00-\u9fa5]+".to_string(),
        ];
        let res = use_regex(src, patts);
        assert_eq!(
            res,
            vec![
                vec![Some("123"), Some("abc"), Some("ABC"), None],
                vec![None, None, None, Some("你好")]
            ]
        )
    }
}
