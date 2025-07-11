#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Run the server
node .output/server/index.mjs
