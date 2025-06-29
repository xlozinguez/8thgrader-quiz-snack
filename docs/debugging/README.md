# Debugging Documentation

This directory contains detailed documentation of debugging processes, lessons learned, and best practices for avoiding common pitfalls in our project.

## Documents

### [Snack Publishing Debug Journey](./snack-publishing-debug.md)
Complete timeline of debugging the automated Expo Snack publishing feature, including:
- Problem identification and root cause analysis
- Multiple solution attempts and their outcomes
- Technical implementation details
- Prevention checklist for future similar issues

### [YAML + JavaScript Integration Gotchas](./yaml-javascript-gotchas.md)
Common pitfalls and solutions when embedding JavaScript code in YAML files:
- Template literal escaping issues
- Heredoc delimiter conflicts
- Indentation problems
- Environment variable handling
- Best practices and quick reference guide

## When to Add New Debugging Documentation

Create new debugging documents when:
- A bug takes more than 3 attempts to resolve
- The solution involves non-obvious technical details
- Multiple technologies interact in complex ways
- The issue could easily recur in future development
- The debugging process reveals important lessons about tooling or frameworks

## Documentation Template

When creating new debugging documents, include:

1. **Problem Statement**: Clear description of the issue
2. **Timeline**: Chronological list of attempts and outcomes
3. **Root Cause Analysis**: Technical explanation of why the issue occurred
4. **Solution Details**: Exact implementation that resolved the issue
5. **Lessons Learned**: Key takeaways and best practices
6. **Prevention**: Checklist or guidelines to avoid similar issues
7. **References**: Links to relevant documentation or resources

## Contributing

When debugging complex issues:
1. Document your process as you go
2. Include error messages and logs
3. Note what didn't work and why
4. Update documentation after successful resolution
5. Consider adding preventive measures to CI/CD pipelines