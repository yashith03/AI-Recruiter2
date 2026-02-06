# ======= DEPS STAGE =======
FROM node:20-slim AS deps
# Avoid Puppeteer downloading its own Chromium during npm install; we'll
# install a system browser in the runtime image instead.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

# ======= BUILDER STAGE =======
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Mock environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL="https://mock-project.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="mock-anon-key"

RUN npm run build

# ======= RUNNER STAGE =======
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

## Install system Chromium and required libraries for Puppeteer before switching to unprivileged user
# We install as root here and then switch to `nextjs` so the runtime can access
# the system Chromium binary while still running as an unprivileged user.
USER root
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		fonts-liberation \
		libasound2 \
		libatk1.0-0 \
		libc6 \
		libcairo2 \
		libdbus-1-3 \
		libexpat1 \
		libfontconfig1 \
		libgcc1 \
		libgconf-2-4 \
		libgdk-pixbuf2.0-0 \
		libglib2.0-0 \
		libgtk-3-0 \
		libnspr4 \
		libnss3 \
		libpango-1.0-0 \
		libx11-6 \
		libx11-xcb1 \
		libxcb1 \
		libxcomposite1 \
		libxcursor1 \
		libxdamage1 \
		libxext6 \
		libxfixes3 \
		libxi6 \
		libxrandr2 \
		libxrender1 \
		libxss1 \
		libxtst6 \
		lsb-release \
		wget \
		xdg-utils \
		chromium \
	&& rm -rf /var/lib/apt/lists/*

# Ensure prerender cache folder exists and set ownership
RUN mkdir -p .next && chown nextjs:nodejs .next

# Restore to unprivileged user
USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
