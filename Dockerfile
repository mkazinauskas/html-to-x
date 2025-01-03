FROM node:20-bookworm AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY . .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030

# ARG PLAYWRIGHT_CONCURRENT_PDF_WORKERS
# ENV PLAYWRIGHT_CONCURRENT_PDF_WORKERS=${PLAYWRIGHT_CONCURRENT_PDF_WORKERS}

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build; 

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM mcr.microsoft.com/playwright:v1.49.1-noble AS runner

WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 nextjs

USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

ENV NODE_OPTIONS="--max-old-space-size=800"

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js