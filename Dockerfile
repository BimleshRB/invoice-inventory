FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
 RUN npm install --prefer-offline --no-audit

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy from builder
 COPY --from=builder /app/node_modules ./node_modules
 COPY --from=builder /app/.next/standalone ./
 COPY --from=builder /app/.next/static ./.next/static
 COPY --from=builder /app/public ./public
COPY package*.json ./

# Install only production dependencies
 RUN npm install --prefer-offline --no-audit

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
