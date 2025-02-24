const { Client } = require("@elastic/elasticsearch");
const logger = require("./logger");

const ELASTICSEARCH_HOST =
  process.env.ELASTICSEARCH_HOST || "http://localhost:9200";

// Elasticsearch client
const client = new Client({
  node: ELASTICSEARCH_HOST,
});

/**
 * Function to create an index if it doesn't exist
 * @param {string} indexName 
 */
async function createIndex(indexName) {
  try {
    const exists = await client.indices.exists({ index: indexName });

    if (!exists) {
      await client.indices.create({ index: indexName });
      logger.info(`Index "${indexName}" created.`);
    } else {
      logger.info(`Index "${indexName}" already exists.`);
    }
  } catch (error) {
    console.error("Error creating index:", error);
  }
}

exports.createIndex = createIndex;

exports.client = client;
