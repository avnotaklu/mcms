#!/bin/sh

# Wait for Elasticsearch to be ready
until curl -s http://elasticsearch:9200/_cluster/health | grep -E '"status":"green"|"status":"yellow"'; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

echo "Elasticsearch is up!"

# Check if index exists
INDEX_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" http://elasticsearch:9200/$1)

if [ "$INDEX_EXISTS" -ne 200 ]; then
  echo "Creating index '$1'..."
  curl -X PUT "http://elasticsearch:9200/$1" -H "Content-Type: application/json" -d '{
    "mappings": {
      "properties": {
        "name": { "type": "text" },
        "age": { "type": "integer" }
      }
    }
  }'
else
  echo "Index 'my_index' already exists. Skipping creation."
fi

exec node server.js
