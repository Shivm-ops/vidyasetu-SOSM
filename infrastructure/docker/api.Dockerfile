FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
COPY services/api/package.json ./services/api/
COPY packages/db/package.json ./packages/db/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/db && npx prisma generate
RUN cd services/api && npm run build

# Runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/services/api

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/packages/db/prisma ./prisma
COPY --from=builder /app/packages/db/node_modules/.prisma /app/node_modules/.prisma

EXPOSE 3001
CMD ["node", "dist/server.js"]
