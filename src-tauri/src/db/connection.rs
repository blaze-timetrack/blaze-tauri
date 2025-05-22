use serde::{Deserialize, Serialize};
use surrealdb::engine::any;
use surrealdb::opt::auth::Root;
use tokio;

// Open a connection
let db = any::connect("wss://blaze--time-tra-06bdubvl4pv4t6a2oniuik9d04.aws-euw1.surreal.cloud").await?;

// Select namespace and database
db.use_ns("test").use_db("test").await?;

// Authenticate
db.signin(Root {
	username: "root",
	password: "root",
}).await?;