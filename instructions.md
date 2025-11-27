
### Project identity

* Fix `project_name`, `project_slug`, `module_name` early; all app code lives in `src/{module_name}`.
* Use `project_short_description` as the one-line explanation you also show to AI.

* Metadata reuse

  * `full_name`, `company_name`, `email` live in existing config; AI must reuse them, not invent new ones.
* Folder contract

  * `src/{module_name}` = production code.
  * `tests/` = `pytest` tests only.
  * `notebooks/` = exploration; reusable logic must be moved into `src`.
  * `config/` = all non-secret settings and environment variants.
* Single dependency system

  * Pick exactly one: `conda` / `pip` / `poetry`.
  * AI only edits the matching files (`environment*.yml` or `requirements*.txt` or `pyproject.toml`).
  * No extra env managers or lockfiles.
* Configuration rules

  * Choose `yaml` or `hocon` once.
  * New flags/paths go into config files, not hard-coded.
* Code style

  * If `black` is enabled, all code must be `black`-compatible.
  * Default to PEP 8; no custom house style.
* CLI behavior (if enabled)

  * All CLI features extend the existing Typer-based app, not new ad-hoc scripts.
* Testing discipline

  * Any behavior change requires tests in `tests/` named `test_*.py`.
  * `pytest` is the only test runner to target.
* Tooling and dotfiles

  * Respect `.editorconfig` for whitespace/line endings.
  * Keep code compliant with `.pre-commit-config.yaml` hooks.
  * Do not add conflicting editor/test configs beyond `.vscode` (or `.idea` if you use it).
* Documentation and runtime

  * `README.md` must stay in sync with install/run/test instructions.
  * If `use_docker` is true, runtime changes must be reflected in `Dockerfile` and `docker-compose.yml`.
