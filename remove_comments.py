#!/usr/bin/env python3
import re
import sys
from pathlib import Path


def remove_comments(content):
    """Remove both single-line and multi-line comments from code"""

    # First, handle multi-line comments /* ... */
    # This regex handles nested comments carefully
    content = re.sub(r"/\*[\s\S]*?\*/", "", content)

    # Remove lines that are only comments (with optional whitespace)
    lines = content.split("\n")
    result_lines = []

    for line in lines:
        # Check if line is only a comment (starts with optional whitespace then //)
        if re.match(r"^\s*//.*$", line):
            # Skip comment-only lines, but preserve empty lines
            result_lines.append("")
        else:
            # Remove inline comments but keep the code
            # Be careful not to remove // inside strings
            modified_line = line

            # Simple approach: look for // that's not in a string
            in_single_quote = False
            in_double_quote = False
            in_template_literal = False
            i = 0
            code_part = ""

            while i < len(modified_line):
                char = modified_line[i]

                # Handle escape sequences
                if i > 0 and modified_line[i - 1] == "\\":
                    code_part += char
                    i += 1
                    continue

                # Track quote state
                if char == "'" and not in_double_quote and not in_template_literal:
                    in_single_quote = not in_single_quote
                elif char == '"' and not in_single_quote and not in_template_literal:
                    in_double_quote = not in_double_quote
                elif char == "`" and not in_single_quote and not in_double_quote:
                    in_template_literal = not in_template_literal

                # Check for comment start
                if (
                    char == "/"
                    and i + 1 < len(modified_line)
                    and modified_line[i + 1] == "/"
                    and not in_single_quote
                    and not in_double_quote
                    and not in_template_literal
                ):
                    # Found a comment, stop here
                    code_part = code_part.rstrip()
                    break

                code_part += char
                i += 1

            result_lines.append(code_part)

    # Join lines back together
    result = "\n".join(result_lines)

    # Remove multiple consecutive empty lines, keeping only max 2
    result = re.sub(r"\n\n\n+", "\n\n", result)

    # Remove trailing whitespace from each line
    lines = result.split("\n")
    lines = [line.rstrip() for line in lines]
    result = "\n".join(lines)

    return result


def process_file(file_path):
    """Process a single file to remove comments"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = remove_comments(content)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

        print(f"✓ Processed: {file_path}")
        return True
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False


# Files to process
files_to_process = [
    "./src/sdk/core/auth.ts",
    "./src/main.tsx",
    "./src/components/ui/chart.tsx",
    "./src/components/ui/calendar.tsx",
    "./src/components/ui/dialog.tsx",
    "./src/components/ui/sidebar.tsx",
    "./src/components/ui/toggle.tsx",
    "./src/components/ui/form.tsx",
    "./src/components/FloatingBanner.tsx",
    "./src/components/ErrorBoundary.tsx",
    "./src/vite-env.d.ts",
    "./src/lib/auth-integration.ts",
    "./src/sdk/core/mcp-client.ts",
    "./src/sdk/core/request.ts",
    "./src/sdk/core/global.ts",
    "./src/sdk/core/internal/creao-shell.ts",
    "./src/sdk/core/internal/internal-types.ts",
    "./src/sdk/constants/mcp-server.ts",
    "./config/eslint/index.js",
    "./config/eslint/base.config.js",
    "./config/eslint/validate-configs.js",
    "./vite.config.js",
    "./vitest.config.js",
    "./eslint.config.js",
]

if __name__ == "__main__":
    base_dir = Path(".")

    success_count = 0
    for file in files_to_process:
        file_path = base_dir / file
        if file_path.exists():
            if process_file(file_path):
                success_count += 1
        else:
            print(f"⊘ File not found: {file}")

    print(f"\n✓ Successfully processed {success_count}/{len(files_to_process)} files")
