# ─── Stage 1: Build Expo web bundle ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Build-time env (injected by Cloud Build from Secret Manager)
ARG EXPO_PUBLIC_API_URL=http://localhost:8081/api
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npx expo export -p web --output-dir dist

# ─── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run requires port 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
