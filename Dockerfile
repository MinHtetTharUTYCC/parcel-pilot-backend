# ---------- 1. BUILD STAGE ----------
FROM node:20-alpine AS source_build
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN pnpm run build

# ---------- 2. PRODUCTION STAGE ----------
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy dependencies and built files
COPY --from=source_build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=source_build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=source_build --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=source_build --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs

ENV NODE_ENV=production
EXPOSE 6000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
