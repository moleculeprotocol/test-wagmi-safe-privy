#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <string_to_insert> <file_glob_pattern>"
    exit 1
fi

string_to_insert="$1"
file_glob_pattern="$2"

# Loop through each file matching the glob pattern
for file in $file_glob_pattern; do
    # Check if the file exists
    if [ -e "$file" ]; then
        # Insert the string as the first line using temporary file
        temp_file=$(mktemp)
        echo "$string_to_insert" | cat - "$file" > "$temp_file"
        mv "$temp_file" "$file"
        #echo "Inserted '$string_to_insert' into $file"
    fi
done
