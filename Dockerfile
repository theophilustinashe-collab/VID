# Use Node 20 as base
FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy the entire workspace
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API server and its dependencies
RUN pnpm --filter @workspace/api-server build

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the API server directly with node for efficiency
CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
