#!/bin/sh

# initialize db
mongo --port 27017 ./mongodb/initialize_db.js

# run test!
deno test --allow-net --allow-read --allow-env --import-map=import_map.json --unstable

