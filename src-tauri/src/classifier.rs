use anyhow::Result;
use rust_bert::pipelines::common::ModelResource;
use rust_bert::pipelines::sequence_classification::{SequenceClassificationConfig, SequenceClassificationModel};
use rust_bert::resources::{LocalResource, ResourceProvider};
use std::path::Path;
use std::sync::Mutex;

pub struct Classifier {
    model: SequenceClassificationModel,
}


impl Classifier {
    pub fn new() -> Result<Self> {
        let model_path = "models/bert-mini2";
        let model_resource = LocalResource {
            local_path: Path::new(model_path).join("pytorch_model.bin"),
        };
        let config_resource = LocalResource {
            local_path: Path::new(model_path).join("config.json"),
        };

        let vocab_resource = LocalResource {
            local_path: Path::new(model_path).join("vocab.txt"),
        };

        let config = SequenceClassificationConfig {
            model_type: rust_bert::pipelines::common::ModelType::Bert,
            model_resource: ModelResource::Torch(Box::new(model_resource) as Box<dyn ResourceProvider + Send>),
            config_resource: Box::new(config_resource) as Box<dyn ResourceProvider + Send>,
            vocab_resource: Box::new(vocab_resource) as Box<dyn ResourceProvider + Send>,
            device: tch::Device::Cpu,
            ..Default::default()
        };
        let model = SequenceClassificationModel::new(config)?;
        Ok(Self { model })
    }

    pub fn classify(&self, text: &str) -> String {
        self.model.predict(&[text])
            .first()
            .cloned().unwrap().text
    }
}

#[tauri::command]
pub async fn classify_text(text: String, classifier: tauri::State<'_, Mutex<Classifier>>) -> Result<String, std::boxed::Box<dyn std::error::Error + Send + Sync + 'static>> {
    let classifier = classifier.lock().unwrap();
    Ok(classifier.classify(&text).clone())
}