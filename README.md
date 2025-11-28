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
├── src/doughub2/     # Python backend (FastAPI)
├── frontend/         # React + TypeScript frontend (Vite)
├── tests/            # pytest tests
├── notebooks/        # Jupyter notebooks for exploration
├── config/           # Configuration files (YAML)
├── data/             # Data files (gitignored except .gitkeep)
└── pyproject.toml    # Poetry configuration
```

### Frontend Development

The frontend is built with React, TypeScript, Tailwind CSS, and Vite.

```bash
# Navigate to frontend directory
cd src/doughub2/ui/frontend

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

## Running in Production

To run the integrated application (backend + frontend) in production mode:

### 1. Build the Frontend

```bash
# Navigate to the frontend directory
cd src/doughub2/ui/frontend

# Install dependencies (if not already done)
npm install

# Build the production bundle
npm run build
```

This creates a `dist` directory with the optimized React application.

### 2. Start the Backend Server

```bash
# Navigate back to the project root
cd ../../../..

# Run the server with uvicorn
poetry run uvicorn doughub2.main:api_app --host 0.0.0.0 --port 8000
```

### 3. Access the Application

Open your browser and navigate to `http://localhost:8000`. The FastAPI backend serves both:

- The React UI at the root path (`/`)
- API endpoints at their respective paths (`/questions`, `/extract`, etc.)

**Note:** The frontend must be built before running in production mode. In development, run the Vite dev server (`npm run dev`) and the backend server (`poetry run doughub2 serve`) separately for hot-reloading.

## Contact

Douglas Smith (<douglas.smith@digdug.com>)

## License

© DigDug
