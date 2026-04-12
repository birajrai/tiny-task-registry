# Contributing to Tiny-Task Registry

Thank you for your interest in contributing! We follow a structured process to ensure high-quality, secure, and maintainable micro-tasks.

## 📋 Contribution Process

1. **Fork the Repository**: Create your own branch from `main`.
2. **Create a Skill**: Use the naming convention `registry/[category]/[your-skill-id]`.
3. **Follow the Template**: Use the [SKILL_TEMPLATE.md](docs/SKILL_TEMPLATE.md) for your `SKILL.md`.
4. **Self-Validate**: Ensure your skill passes the schema validation.
5. **Submit a PR**: Provide a clear description and example inputs.

## 📏 Skill Standards

- **Metadata**: Every skill must include YAML frontmatter.
- **Security**: No hardcoded API keys or sensitive data.
- **Portability**: Skills should be independent and reusable.

## 🧪 Automated Testing

Your PR will trigger a CI pipeline that runs:
- Schema validation
- Security scanning
- Quality scoring (LLM-based)

For more details, see the [Maintainer Guide](docs/maintainers/audit.md).
