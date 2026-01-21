# ---------- 1. BUILD STAGE ----------
FROM node:20-alpine AS source_build
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configs from root
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy the actual code folders
COPY shared ./shared
COPY backend ./backend

# Install all dependencies (from root so it sees the lockfile)
RUN pnpm install --frozen-lockfile

# Move into backend to build
WORKDIR /app/backend
RUN npx prisma generate
RUN pnpm run build

# ---------- 2. PRODUCTION STAGE ----------
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# COPY EVERYTHING from the root node_modules to ensure shared links work
COPY --from=source_build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=source_build --chown=nodejs:nodejs /app/shared ./shared
COPY --from=source_build --chown=nodejs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=source_build --chown=nodejs:nodejs /app/backend/dist ./backend/dist
COPY --from=source_build --chown=nodejs:nodejs /app/backend/prisma ./backend/prisma
COPY --from=source_build --chown=nodejs:nodejs /app/backend/package.json ./backend/package.json

WORKDIR /app/backend
USER nodejs

ENV NODE_ENV=production
EXPOSE 6000

ENTRYPOINT ["dumb-init", "--"]
# If your code uses tsconfig-paths in production, it needs to find it
CMD ["node", "dist/main.js"]
