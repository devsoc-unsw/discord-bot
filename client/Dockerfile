# Development stage
FROM node:22.16-bookworm AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "dev"]

# Production stage
FROM node:22.16-bookworm-slim AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --prod
COPY . .
CMD ["pnpm", "start"]