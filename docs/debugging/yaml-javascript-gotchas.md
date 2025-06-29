# YAML + JavaScript Integration Gotchas

## Overview
Common pitfalls and solutions when embedding JavaScript code in YAML files, particularly for GitHub Actions workflows.

## Template Literals in YAML Heredocs

### ❌ What Doesn't Work
```yaml
run: |
  cat > script.js << 'EOF'
  const url = `https://example.com/${id}`;
  console.log(`Processing ${count} items`);
  EOF
```

**Problems:**
- YAML interpreters may escape backticks and dollar signs
- Results in syntax like `\`\${variable}\`` in the generated file
- Causes JavaScript SyntaxError: Invalid or unexpected token

### ✅ What Works
```yaml
run: |
  cat > script.js << 'EOF'
  const url = 'https://example.com/' + id;
  console.log('Processing ' + count + ' items');
  EOF
```

## Heredoc Delimiters

### ❌ Common Conflicts
```yaml
run: |
  cat > script1.js << 'EOF'
  // script content
  EOF
  cat > script2.js << 'EOF'  # Same delimiter!
  // more content
  EOF
```

### ✅ Unique Delimiters
```yaml
run: |
  cat > script1.js << 'SCRIPT1_EOF'
  // script content
  SCRIPT1_EOF
  cat > script2.js << 'SCRIPT2_EOF'
  // more content
  SCRIPT2_EOF
```

## YAML Indentation Issues

### ❌ Incorrect Indentation
```yaml
run: |
  if [ condition ]; then
    cat > script.js << 'EOF'
const data = {
  key: 'value'  # This indentation will be preserved in the file!
};
EOF
  fi
```

### ✅ Proper Indentation
```yaml
run: |
  if [ condition ]; then
    cat > script.js << 'EOF'
const data = {
  key: 'value'
};
EOF
  fi
```

## Multi-line String Handling

### ❌ Problematic Approach
```yaml
run: |
  echo "const message = \`
  This is a multi-line
  string with ${variable}
  \`;" > script.js
```

### ✅ Better Approach
```yaml
run: |
  cat > script.js << 'EOF'
const message = 'This is a multi-line\n' +
  'string with ' + variable + '\n' +
  'content';
EOF
```

## Complex Object Construction

### ❌ Template Literal Approach
```yaml
run: |
  cat > config.js << 'EOF'
const config = {
  url: `${baseUrl}/api`,
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
EOF
```

### ✅ String Concatenation Approach
```yaml
run: |
  cat > config.js << 'EOF'
const config = {
  url: baseUrl + '/api',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};
EOF
```

## Environment Variable Access

### ❌ Mixing YAML and JS Variables
```yaml
run: |
  cat > script.js << 'EOF'
const token = ${{ secrets.API_TOKEN }};  # YAML interpolation in heredoc
const url = `${process.env.BASE_URL}/api`;  # Template literal
EOF
```

### ✅ Proper Environment Variable Handling
```yaml
run: |
  cat > script.js << 'EOF'
const token = process.env.API_TOKEN;
const url = process.env.BASE_URL + '/api';
EOF
env:
  API_TOKEN: ${{ secrets.API_TOKEN }}
  BASE_URL: ${{ vars.BASE_URL }}
```

## Best Practices Summary

### 1. String Handling
- Use string concatenation (`+`) instead of template literals in YAML heredocs
- Escape special characters properly
- Be mindful of quote types (single vs double)

### 2. Delimiter Management
- Use unique, descriptive delimiters (`SCRIPT_EOF`, `CONFIG_EOF`)
- Avoid generic names like `EOF` when multiple heredocs exist
- Quote delimiters to prevent variable expansion

### 3. Indentation Control
- Keep JavaScript code at consistent indentation level
- Use proper YAML block scalar indicators (`|`, `>`)
- Test generated files to ensure correct formatting

### 4. Variable Scope
- Separate YAML variables from JavaScript variables
- Use environment variables for passing data between contexts
- Avoid mixing YAML interpolation with JavaScript template literals

### 5. Testing Strategy
- Test JavaScript syntax separately before embedding
- Use local tools like `yamllint` for YAML validation
- Generate and inspect intermediate files during debugging

## Quick Reference

| Need | Use | Avoid |
|------|-----|-------|
| String concatenation | `'str1' + var + 'str2'` | `\`str1\${var}str2\`` |
| Multi-line strings | `'line1\n' + 'line2'` | Backtick multi-line |
| Unique delimiters | `SCRIPT_EOF` | `EOF` (generic) |
| Environment vars | `process.env.VAR` | `${{ vars.VAR }}` in heredoc |
| Complex objects | Object syntax with `+` | Template literal objects |

## Related Issues
- React 19 + Expo SDK version conflicts
- npm peer dependency resolution
- GitHub Actions environment variable scoping
- Shell script quoting in YAML contexts