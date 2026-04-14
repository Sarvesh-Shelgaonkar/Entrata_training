# Stage 1: Build Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# Build argument for Vite
ARG VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
RUN npm run build

# Stage 2: Production Image
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY api ./api

# Copy the built frontend from Stage 1 into client/dist
COPY --from=build-frontend /app/client/dist ./client/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
