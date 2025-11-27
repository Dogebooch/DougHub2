# Doughub2

A personal hub project by Douglas Smith

## Getting Started

This project uses [Poetry](https://python-poetry.org/) for dependency management.

### Installation

Install Poetry if you haven't already:

```bash
pip install poetry
```

Install project dependencies:

```bash
poetry install
```

Activate the virtual environment:

```bash
poetry shell
```

### Running the CLI

Access the CLI with:

```bash
poetry run doughub2 --help
```

Or within the poetry shell:

```bash
python -m doughub2 --help
```

### Testing

We use `pytest` as the test framework. To run tests:

```bash
poetry run pytest
```

To run tests with coverage reporting:

```bash
poetry run pytest --cov=src --cov-report=html --cov-report=term
```

After running the tests, open the `htmlcov` directory in your browser to inspect coverage visually.

### Distribution Package

To build a distribution package (wheel):

```bash
poetry build
```

Build artifacts will be placed in the `dist/` directory.

### Contributions

Before contributing, set up the pre-commit hooks to ensure consistent formatting and linting:

```bash
poetry run pre-commit install
```

This will automatically run checks like code formatting, import sorting, and linting before each commit.

To uninstall the hooks:

```bash
poetry run pre-commit uninstall
```

## Project Structure

```
doughub2/
├── src/doughub2/     # Main module (production code)
├── tests/            # pytest tests
├── notebooks/        # Jupyter notebooks for exploration
├── config/           # Configuration files (YAML)
├── data/             # Data files (gitignored except .gitkeep)
└── pyproject.toml    # Poetry configuration
```

## Contact

Douglas Smith (douglas.smith@digdug.com)

## License

© DigDug
