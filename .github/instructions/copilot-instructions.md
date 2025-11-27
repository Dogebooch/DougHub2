# Doughub2 Project Instructions

## Project Overview

Doughub2 is a personal hub project by Douglas Smith. It is a Python-based application with a React frontend, designed for:

1. **Question Extraction** - Parse and extract questions from HTML/documents
2. **AI Teaching/Learning Pipeline** - Local AI agent using Ollama for structured learning
3. **Anki Integration** - Card editing, management, and synchronization
4. **Persistent Notebook** - Notesium-based knowledge base with normalized topic grouping and bi-directional linking

## Agent Roles

This project uses a **two-agent workflow**:

| Agent | Model | Role |
|-------|-------|------|
| **Gemini Code Assist** | Gemini | Project Lead & Planner - creates prompt.md files |
| **GitHub Copilot** | Claude Opus 4.5 | Developer - implements code, manages files, refactors |

**Your role (Copilot)**: You are the **developer agent**. You execute implementation tasks defined in prompt.md files or direct user requests. You write code, manage files, design UI, refactor, and handle GitHub operations.

## Accuracy and Verification

**Never hallucinate.** This is critical:

- Do not make up information, code, APIs, function names, or file paths.
- If unsure about something, search the codebase or ask for clarification.
- Verify assumptions by reading existing code before implementing changes.
- If you lack information to complete a task, say so clearly rather than guessing.
- When referencing external libraries or APIs, verify they exist and are used correctly.

## Instruction Files (Your Toolbox)

When implementing tasks, consult the relevant instruction file:

| Task Type | Instruction File |
|-----------|------------------|
| API design, TypeScript/Python models | `API_CONTRACT.instructions.md` |
| FastAPI routes, backend logic | `BACKEND_API.instructions.md` |
| React hooks, data fetching | `FRONT_BACK_WIRING.instructions.md` |
| Architecture decisions, planning | `PROJECT_LEAD.instructions.md` |
| React components, Tailwind styling | `UI_LAYOUT.instructions.md` |

**Always read the relevant instruction file before implementing** to ensure consistency with project standards.

## Technology Stack

### Backend (Python)
- **Language**: Python 3.9+
- **Package Manager**: Poetry (pyproject.toml)
- **CLI Framework**: Typer
- **API Framework**: FastAPI
- **Database**: SQLAlchemy + SQLite
- **AI/ML**: Ollama (local LLM)
- **Knowledge Base**: Notesium (markdown notes with bi-directional links)
- **Configuration**: PyYAML

### Frontend (React)
- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS (dark theme)
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP**: Native fetch API (no axios)

### Code Quality
- **Formatter**: Black (line-length 88)
- **Import Sorter**: isort (black profile)
- **Testing**: pytest with pytest-cov
- **Pre-commit**: Hooks for formatting enforcement

## Notesium Integration (Persistent Notebook)

Notesium provides a Zettelkasten-style knowledge base with:

### Core Concepts
- **Flat file structure**: All notes in one directory (`data/notes/`)
- **Hex filenames**: Notes named with 8-digit hex (e.g., `625d563f.md`)
- **Bi-directional links**: `[link text](625d563f.md)` format
- **Labels**: One-word title notes act as topic categories
- **Graph visualization**: Visual relationships between notes

### Topic Normalization
Use labels (one-word title notes) for normalized topic grouping:
```markdown
# Cardiology
<!-- This note acts as a label/category -->

Links to all cardiology-related notes...
```

### Note Structure
```markdown
# Note Title

Content with [[bi-directional links]] to other notes.

Related: [Cardiology](a1b2c3d4.md) | [HighYield](e5f6g7h8.md)
```

### Integration Points
- Questions extracted → linked to topic labels
- AI learning sessions → create/update notes
- Anki cards → bi-directionally linked to source notes
- Graph view → visualize knowledge connections

## Directory Structure

The top-level directory structure is **fixed**. Do not rename, remove, or reorganize these parent folders:

| Directory | Purpose |
|-----------|---------|
| `src/doughub2/` | Production source code only. All application logic lives here. |
| `src/doughub2/ui/` | UI components and interfaces. |
| `tests/` | pytest tests. Files must follow `test_*.py` naming convention. |
| `notebooks/` | Jupyter notebooks for prototyping. Move to `src/` when ready. |
| `config/` | YAML configuration files. Runtime settings go here. |
| `data/` | Data files (gitignored). Never commit data to the repository. |
| `data/notes/` | Notesium notes directory (flat structure, hex filenames). |
| `.github/` | GitHub-related files including these instructions. |

### Folder Organization Rules

- **Use subfolders** to organize code logically within `src/doughub2/`.
- Create new subfolders as needed for distinct features or domains.
- Do not change or rename the parent folders listed above.
- Keep related functionality grouped together in the same subfolder.

## Development Workflow

### Notebook-First Development

When building new features:

1. **Prototype in notebooks**: Create a Jupyter notebook in `notebooks/` to explore and develop the feature.
2. **Iterate and test**: Use the notebook environment to experiment, visualize, and validate the approach.
3. **Refactor for production**: Once the feature is working and validated, refactor the code into proper modules.
4. **Move to src**: Place production-ready code in `src/doughub2/` under an appropriate subfolder.
5. **Write tests**: Add comprehensive tests in `tests/` for the new functionality.
6. **Clean up**: Remove or archive the exploratory notebook once the feature is implemented.

This workflow keeps experimental code separate from production code and ensures features are properly validated before integration.

## Coding Standards

### Style and Formatting

- Use Black for all Python formatting. It runs automatically on save in VS Code.
- Use isort for import sorting with the "black" profile for compatibility.
- Maximum line length is 88 characters.
- Pre-commit hooks enforce formatting—do not bypass them.

### Naming Conventions

- Use `snake_case` for functions, variables, and module names.
- Use `PascalCase` for class names.
- Use `SCREAMING_SNAKE_CASE` for constants.
- Prefix private functions and variables with a single underscore (`_private_func`).
- Use descriptive, meaningful names. Avoid abbreviations unless widely understood.

### Code Organization

- Keep functions small and focused on a single responsibility.
- Prefer composition over inheritance.
- Use type hints for all function signatures.
- Write docstrings for public functions and classes.
- Group imports: standard library, third-party, local (isort handles this).

### Configuration

- All configuration belongs in `config/config.yml`.
- Never hard-code configuration values in source code.
- Use environment variables for secrets, not config files.

## Dependency Management

- **Add a dependency**: `poetry add <package>`
- **Add a dev dependency**: `poetry add --group dev <package>`
- **Install all dependencies**: `poetry install`
- **Update dependencies**: `poetry update`
- Always specify version constraints when adding dependencies.

## Entry Point and CLI

### Single Entry Point

`src/doughub2/main.py` is the **single entry point** for the application:

- All CLI commands must be defined in or routed through `main.py`.
- Do not create alternative entry points or separate CLI scripts.
- New features should expose their functionality through commands in `main.py`.
- The entry point is registered as `doughub2.main:app` in `pyproject.toml`.

### CLI Usage

- Run the CLI: `poetry run doughub2 -c config/config.yml`
- Add new commands by creating functions decorated with `@app.command()` in `src/doughub2/main.py`.
- For complex commands, implement the logic in a separate module and call it from the command function.

## Testing Guidelines

### Purpose of Tests

Tests serve multiple critical purposes:

- **Prevent regressions**: Ensure new changes don't break existing functionality.
- **Document behavior**: Tests describe what the code should do, serving as living documentation.
- **Enable safe refactoring**: With good test coverage, code can be confidently restructured.
- **Guide the AI**: Tests help the coding agent understand expected behavior and verify changes are correct.

### Testing Requirements

- Framework: pytest
- Run tests: `poetry run pytest`
- Run with coverage: `poetry run pytest --cov=src`
- Test files must be named `test_*.py` and placed in `tests/`.

### Testing Practices

- **Write tests immediately** when adding new functionality—not later.
- **Test all public interfaces**: Every public function and command should have tests.
- **Use descriptive test names**: Test names should clearly describe what they verify.
- **Keep tests isolated**: Tests should not depend on each other or external state.
- **Use fixtures** for shared test setup and to reduce duplication.
- **Test edge cases**: Include tests for error conditions and boundary cases.
- **Aim for meaningful coverage**: Focus on critical paths, not just high percentages.

## Automatic Verification

After completing any change or request, **always verify the changes**:

1. **Run the test suite**: `poetry run pytest`
2. **Run linting/formatting**: `poetry run pre-commit run --all-files`
3. **Fix any failures**: If tests or linting fail, fix the issues before considering the task complete.
4. **Verify no regressions**: Ensure existing tests still pass—this confirms previous features weren't broken.

This verification step is mandatory. A change is not complete until all tests pass and linting succeeds.

## Git Workflow

After completing a task and verifying all tests pass, **always commit and push changes**:

1. **Stage relevant files**: Only stage files related to the current task (avoid unrelated formatting changes in node_modules, etc.)
2. **Write a descriptive commit message** using conventional commits format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `test:` for adding or updating tests
   - `docs:` for documentation changes
   - `chore:` for maintenance tasks
3. **Include a detailed body** explaining:
   - What was changed and why
   - Key files modified
   - Any breaking changes or important notes
4. **Push to remote**: Always push after committing so changes are preserved

### Example Commit Message

```
feat: Add pydantic-settings and integration test for extraction output

STEP-08 Implementation:

- Add pydantic-settings dependency for configuration management
- Refactor config.py to use Pydantic Settings class
- Add integration test for extraction file output
- Update Python requirement to >=3.10

All tests pass.
```

### Commands

```bash
# Stage specific files
git add <file1> <file2>

# Commit with message
git commit -m "type: Short description

Detailed explanation of changes..."

# Push to remote
git push
```

This ensures all work is tracked, documented, and backed up to the remote repository.

## Pre-commit Hooks

```bash
# Initial setup (run once)
poetry run pre-commit install

# Run manually on all files
poetry run pre-commit run --all-files
```

Pre-commit runs Black and isort automatically before each commit.

## Prohibited Practices

- Do not commit code that fails pre-commit hooks.
- Do not hard-code secrets, API keys, or passwords anywhere in the codebase.
- Do not commit data files or large binary files.
- Do not use `print()` for logging—use proper logging if needed.
- Do not write overly complex functions. If a function exceeds 50 lines, consider refactoring.
- Do not ignore type hints in new code.
- Do not bypass pre-commit hooks with `--no-verify`.
- Do not add dependencies without considering their maintenance status and security.
- Do not create alternative entry points outside of `main.py`.
- Do not rename or reorganize the top-level directory structure.

## Security Considerations

- Store secrets in environment variables, never in code or config files.
- Validate and sanitize all external input.
- Keep dependencies updated to patch security vulnerabilities.
- Review third-party packages before adding them.

## Performance Guidelines

- Profile before optimizing—don't guess at bottlenecks.
- Prefer built-in Python functions and standard library over custom implementations.
- Use generators for large data processing to minimize memory usage.
- Cache expensive computations when appropriate.

## Architectural Principles

- Follow the single responsibility principle.
- Keep the CLI layer thin—business logic belongs in separate modules.
- Use dependency injection for testability.
- Prefer explicit over implicit behavior.
- Write code that is easy to read and maintain over clever code.

## Documentation Maintenance

When making changes to the codebase, update `README.md` to reflect those changes. Specifically:

- **New CLI commands**: Add usage examples under the "Running the CLI" section.
- **New dependencies**: If a significant dependency is added, mention it in the relevant section.
- **Project structure changes**: Update the "Project Structure" section if directories are added, removed, or renamed.
- **New features**: Add a brief description of major new functionality.
- **Configuration changes**: Document any new configuration options or environment variables.
- **Breaking changes**: Clearly note any breaking changes at the top of the README or in a changelog section.

Keep README updates concise and user-focused. The README is for users and contributors—technical implementation details belong in code comments or docstrings, not the README.

## Project Metadata

- **Author**: Douglas Smith
- **Company**: DigDug
- **Email**: douglas.smith@digdug.com
- **License**: Proprietary
