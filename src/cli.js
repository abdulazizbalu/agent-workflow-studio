const { runWorkflow } = require("./workflow");

console.log(JSON.stringify(runWorkflow("launch an AI campaign", { approved: true, retries: 2 }), null, 2));

