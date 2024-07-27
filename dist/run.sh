#!/bin/bash

# Set the source directory where your files are located
SOURCE_DIR="/Users/houzi/home/ai-labs/gpt-runner-intellij/dist"

# Set the output directory where you want the packaged files to be placed
OUTPUT_DIR="/Users/houzi/home/ai-labs/gpt-runner-intellij/dist/packaged"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# List of files to be packaged (you can add more if needed)
FILES=("start-server.cjs" "server.cjs" "gpt-runner-web.eacbd9a0.cjs")

# Loop through the files and copy them to the output directory
for file in "${FILES[@]}"; do
  echo "Packaging $file..."
  cp "$SOURCE_DIR/$file" "$OUTPUT_DIR/$file"
done

echo "Packaging complete!"
