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

# Build the project (includes api-server and shared libs)
RUN pnpm run build

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the API server
CMD ["pnpm", "--filter", "@workspace/api-server", "run", "start"]
