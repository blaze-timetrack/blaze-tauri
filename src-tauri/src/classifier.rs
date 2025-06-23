use anyhow::Result;
use candle_core::Tensor;
use candle_core::{DType, Device, Module};
use candle_nn::Linear;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::ipc::private::tracing::log;
use tauri::ipc::private::tracing::log::__private_api::log;
use tauri::ipc::private::tracing::log::kv::Source;
use tauri::Error::Setup;

pub struct Classifier {
    model: HashMap<String, Tensor>,
}


impl Classifier {
    pub fn new() -> Result<Self> {
        let device = Device::Cpu;
        let resource_dir = std::env::current_dir()?.join("models/bert-mini/bert-mini-candle.safetensors");

        let model = candle_core::safetensors::load(resource_dir, &device)?;

        // let vb = unsafe {
        //     VarBuilder::from_mmaped_safetensors(&[&resource_dir], DType::F32, &device)?
        // };
        //
        // // Load BERT model (adjust config for BERT-mini)
        // let config = Config {
        //     hidden_size: 256,
        //     num_hidden_layers: 4,
        //     // ...other config params from config.json
        //     ..Default::default()
        // };
        // let model = candle_transformers::models::bert::BertModel::load(vb, &config)?;

        Ok(Self { model })
    }

    pub fn classify(&self, text: &str) -> Result<String, String> {
        let device = Device::Cpu;
        let resource_dir = std::env::current_dir().unwrap().join("models/bert-mini/tokenizer.json");
        let weight = self.model.get("bert.encoder.layer.0.attention.self.query.weight").unwrap();
        let bias = self.model.get("bert.encoder.layer.0.attention.self.query.bias").unwrap();

        let linear = Linear::new(weight.clone(), Some(bias.clone()));

        let input_ids = Tensor::zeros((3, 768), DType::F32, &Device::Cpu).unwrap();
        let output = match linear.forward(&input_ids) {
            Ok(v) => v,
            Err(e) => return Err(e.to_string()),
        };

        // // Load tokenizer
        // let tokenizer = Tokenizer::from_file(&resource_dir).unwrap();
        //
        // // Tokenize input
        // let encoding = tokenizer.encode(text, true).unwrap();
        // // Inference
        // let input_ids = Tensor::new(encoding.get_ids().to_vec(), &device).unwrap().unsqueeze(0).unwrap();
        // let token_type_ids = Tensor::new(encoding.get_type_ids().to_vec(), &device).unwrap().unsqueeze(0).unwrap();
        // let attention_mask = Tensor::new(encoding.get_attention_mask().to_vec(), &device).unwrap().unsqueeze(0).unwrap();
        //
        //
        // let output = self.model.forward(&input_ids, &token_type_ids, Some(&attention_mask));
        // // Suppose output is [1, seq_len, num_labels]
        let logits = output.squeeze(0).unwrap(); // [seq_len, num_labels]
        let logits_vec: Vec<Vec<f32>> = logits.to_vec2().unwrap();


        // For each token, find the predicted label
        let label_map = vec!["coding", "design", "productivity", "browser", "marketing"]; // Example
        let predictions: Vec<&str> = logits_vec
            .iter()
            .map(|token_logits| {
                let (idx, _) = token_logits
                    .iter()
                    .enumerate()
                    .max_by(|a, b| a.1.partial_cmp(b.1).unwrap())
                    .unwrap();
                label_map[idx]
            })
            .collect();

        Ok(format!("Token labels: {:?}", predictions))
    }
}

#[tauri::command]
pub async fn classify_text(text: String, classifier: tauri::State<'_, Mutex<Classifier>>) -> tauri::Result<String> {
    log::info!("in to classify text");
    println!("in to classify text");
    let classifier = match classifier.lock() {
        Ok(v) => v,
        Err(e) => return Err(tauri::Error::AssetNotFound(String::from("error in assets"))),
    };
    let output = match classifier.classify(&text).clone() {
        Ok(v) => v,
        Err(e) => return Err(tauri::Error::AssetNotFound(e)),
    };
    Ok(output)
}
