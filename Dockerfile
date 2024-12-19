# Stage 1: Build
FROM node:alpine AS build

# Install PostgreSQL client for application use
RUN apk add --no-cache postgresql-client

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:alpine AS runtime

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the built files and package-lock.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json /usr/src/app/package-lock.json ./

# Install only production dependencies using npm ci
RUN npm ci --only=production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
