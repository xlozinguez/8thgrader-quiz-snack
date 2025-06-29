# Snack Publishing Automation Debug Journey

## Overview
This document chronicles the debugging process for implementing automated Expo Snack publishing via GitHub Actions. The issue started with CI showing "snack publish complete" but no actual Snack appearing in the user's Expo account.

## Problem Statement
- **Initial Issue**: CI workflow claimed Snack publishing was successful
- **User Observation**: No Snack appeared in Expo account at https://expo.dev/accounts/xlozingueztfx/snacks
- **Root Cause**: Workflow was only creating deployment artifacts without making actual API calls to publish Snacks

## Debug Timeline & Attempts

### Attempt 1: Initial Investigation
**Problem**: Workflow showed success but no Snack was published
**Analysis**: The workflow was only creating deployment packages without actual Snack API calls
**Action**: Enhanced workflow to use `snack-sdk` for real API calls

### Attempt 2: npm Dependency Conflicts
**Problem**: 
```
npm error ERESOLVE unable to resolve dependency tree
npm error Could not resolve dependency:
npm error peer react@"^19.1.0" from react-test-renderer@19.1.0
```
**Root Cause**: React version conflicts between React 19.0.0 and react-test-renderer requiring React ^19.1.0
**Solution**: Added `--legacy-peer-deps` flag to npm install command
**Lesson**: Always use `--legacy-peer-deps` when dealing with React 19+ and Expo SDK 53+

### Attempt 3: YAML Heredoc Syntax Errors
**Problem**: 
```
warning: here-document at line 9 delimited by end-of-file (wanted `EOF')
syntax error: unexpected end of file
```
**Root Cause**: Complex YAML heredoc with nested JavaScript causing indentation and delimiter conflicts
**Solution**: Split into separate workflow steps and used unique delimiter `SCRIPT_EOF`
**Lesson**: Avoid complex heredocs in YAML; use separate steps for complex script generation

### Attempt 4: JavaScript Template Literal Escaping
**Problem**: 
```
SyntaxError: Invalid or unexpected token
files[\`screens/\${file}\`] = fs.readFileSync(\`screens/\${file}\`, 'utf8');
```
**Root Cause**: YAML was incorrectly escaping JavaScript template literals (`\`\${}\``)
**Solution**: Replaced template literals with string concatenation (`'screens/' + file`)
**Lesson**: Template literals don't work well inside YAML heredocs; use string concatenation instead

### Attempt 5: SnackSession Import Issues
**Problem**: 
```
❌ Error publishing Snack: SnackSession is not a constructor
TypeError: SnackSession is not a constructor
```
**Root Cause**: Incorrect class name - package exports `Snack` not `SnackSession`
**Analysis**: Debug output revealed available exports: `['getSupportedSDKVersions', 'isFeatureSupported', 'standardizeDependencies', 'getDeprecatedModule', 'defaultConfig', 'Snack', 'createRuntimeUrl', 'parseRuntimeUrl', 'ConnectionMetricsEmitter', 'createTransport', 'createTrafficMirroringTransport']`
**Solution**: Use `Snack` class instead of `SnackSession`, and probe for available methods dynamically
**Result**: ✅ **SUCCESS!** Snack published successfully to https://snack.expo.dev/@xlozingueztfx/8th-grader-quiz-app
**Lesson**: Always check package exports when working with unfamiliar SDKs; API documentation may be outdated

## 🎉 DEPLOYMENT SUCCESS!

After 5 iterations of debugging, the automated Expo Snack publishing finally worked! The CI successfully:
- ✅ Installed snack-sdk with proper dependency resolution
- ✅ Created JavaScript publishing script without syntax errors  
- ✅ Used correct `Snack` class from snack-sdk
- ✅ Published actual Snack to Expo platform
- ✅ Generated public Snack URL: https://snack.expo.dev/@xlozingueztfx/8th-grader-quiz-app

## New Issue Discovered: App.js Export Problem
**Next Challenge**: Snack loads but shows "No default export of 'App.js' to render!"
**Root Cause**: App.js may not have proper default export for Snack environment
**Status**: Ready to debug and fix

## Technical Solutions Applied

### 1. Dependency Management
```yaml
# ❌ Failed approach
npm install snack-sdk node-fetch

# ✅ Working approach  
npm install snack-sdk node-fetch --legacy-peer-deps
```

### 2. YAML Structure
```yaml
# ❌ Failed approach - complex heredoc
- name: Publish to Expo Snack via API
  run: |
    cat > script.js << 'EOF'
    // complex JavaScript with template literals
    EOF

# ✅ Working approach - separate steps
- name: Create Snack publishing script
  run: |
    cat > publish-snack.js << 'SCRIPT_EOF'
    // JavaScript code
    SCRIPT_EOF

- name: Publish to Expo Snack via API
  run: |
    node publish-snack.js
```

### 3. JavaScript String Handling
```javascript
// ❌ Failed approach - template literals in YAML heredoc
files[\`screens/\${file}\`] = fs.readFileSync(\`screens/\${file}\`, 'utf8');
console.log(\`📄 Adding \${Object.keys(files).length} files to Snack...\`);

// ✅ Working approach - string concatenation
files['screens/' + file] = fs.readFileSync('screens/' + file, 'utf8');
console.log('📄 Adding ' + Object.keys(files).length + ' files to Snack...');
```

## Key Lessons Learned

### 1. YAML Heredoc Best Practices
- **Use unique delimiters**: `SCRIPT_EOF` instead of `EOF` to avoid conflicts
- **Keep it simple**: Complex JavaScript should be in separate files or steps
- **Avoid template literals**: Use string concatenation in YAML heredocs
- **Mind indentation**: YAML indentation affects heredoc content

### 2. GitHub Actions CI/CD Patterns
- **Split complex tasks**: Break large steps into smaller, focused steps
- **Use artifacts for debugging**: Upload generated files to understand what's being created
- **Test locally first**: Use tools like `act` to test GitHub Actions locally
- **Check exit codes**: Ensure scripts exit with proper codes (0 for success, 1 for failure)

### 3. Expo SDK Integration
- **Version compatibility**: Expo SDK 53 + React 19 requires `--legacy-peer-deps`
- **API authentication**: Use `EXPO_TOKEN` environment variable for API calls
- **Snack SDK usage**: `SnackSession` requires proper file structure and dependencies
- **Error handling**: Always implement fallbacks for API failures

### 4. Debugging Techniques Used
- **Log analysis**: Used `gh run view --log-failed` to examine specific failure points
- **Incremental fixes**: Made one change at a time to isolate issues
- **Syntax validation**: Checked YAML and JavaScript syntax separately
- **Environment replication**: Matched CI environment versions locally

## Final Working Solution

### File Structure
```
.github/workflows/ci.yml
├── Install snack-sdk and dependencies (with --legacy-peer-deps)
├── Create Snack publishing script (separate step)
└── Publish to Expo Snack via API (execute script)
```

### Key Components
1. **Dependency Installation**: `npm install snack-sdk node-fetch --legacy-peer-deps`
2. **Script Generation**: Separate step using `SCRIPT_EOF` delimiter
3. **String Concatenation**: No template literals in YAML heredocs
4. **Error Handling**: Comprehensive try/catch with fallback options
5. **URL Capture**: Save Snack URL to file for GitHub Actions summary

## Prevention Checklist

Before implementing similar YAML + JavaScript automation:

- [ ] Test JavaScript syntax separately before embedding in YAML
- [ ] Use string concatenation instead of template literals in heredocs
- [ ] Choose unique heredoc delimiters (`SCRIPT_EOF`, not `EOF`)
- [ ] Split complex operations into multiple workflow steps
- [ ] Add `--legacy-peer-deps` for React 19+ projects
- [ ] Test with minimal script first, then add complexity
- [ ] Use proper exit codes (0 for success, 1 for failure)
- [ ] Include comprehensive error logging
- [ ] Validate YAML syntax with yamllint or similar tools

## Resources & References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Snack SDK](https://github.com/expo/snack/tree/main/packages/snack-sdk)
- [YAML Heredoc Syntax](https://yaml.org/spec/1.2/spec.html#id2779048)
- [React 19 Migration Guide](https://react.dev/blog/2024/04/25/react-19)
- [Expo SDK 53 Release Notes](https://expo.dev/changelog/2024/09-18-sdk-53)

## Git Commits Reference

The complete debug journey can be traced through these commits:
- `Fix Snack publishing with actual API calls` - Initial implementation
- `Fix npm install in Snack publishing step` - Added --legacy-peer-deps
- `Fix YAML syntax error in Snack publishing workflow` - Split into separate steps
- `Fix JavaScript syntax errors in Snack publishing script` - String concatenation fix

This debugging process took multiple iterations but resulted in a robust, working Snack publishing automation system.