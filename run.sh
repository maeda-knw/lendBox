#!/bin/sh

deno run --allow-net --allow-read --allow-env --import-map=import_map.json --unstable app.ts
