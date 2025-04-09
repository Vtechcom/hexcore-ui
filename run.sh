#!/bin/bash

# Initialize an array to store environment variables
declare -A env_vars

# Read the .env file and store all key-value pairs
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^# ]] && continue
    
    # Remove any leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Store in associative array
    env_vars["$key"]="$value"
done < .env

# Build the command with all environment variables
CMD=""
for key in "${!env_vars[@]}"; do
    CMD="$CMD$key=${env_vars[$key]} "
done

# Add the fixed parts of the command
CMD="${CMD} node .output/server/index.mjs"

# Execute the command
echo "Running: $CMD"
eval "$CMD"
