# Development stage
FROM node:22.16-bookworm AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . . 
CMD ["pnpm", "run", "dev"]

# Production stage
FROM node:22.16-bookworm-slim AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy source files
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]