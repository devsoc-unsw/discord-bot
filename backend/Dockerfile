# -------- BASE STAGE --------
FROM python:3.13-slim AS base

ENV PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true

RUN pip install --upgrade pip && pip install poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

# -------- STAGE 1: Builder --------
FROM base AS builder

RUN poetry install --no-root --only main

COPY src/ src/
COPY run.py ./

# -------- STAGE 2: Development --------
FROM base AS development

ENV UVICORN_HOST=0.0.0.0 \
    RELOAD=true

RUN poetry install --no-root

COPY src/ src/
COPY run.py ./

EXPOSE 8000
CMD ["poetry", "run", "python", "run.py"]

# -------- STAGE 3: Production --------
FROM base AS production

ENV UVICORN_HOST=0.0.0.0 \
    RELOAD=false

# Copy dependencies + code from builder
COPY --from=builder /app /app

# Gunicorn config
EXPOSE 8000
CMD ["poetry", "run", "gunicorn", "-k", "uvicorn.workers.UvicornWorker", "backend.main:app", "--bind", "0.0.0.0:8000", "--chdir", "src"]
