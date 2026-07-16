# Use lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building Vite)
RUN npm install

# Copy application code
COPY . .

# Build the React production assets
RUN npm run build

# Install express for production serving
RUN npm install express

# Expose server port
EXPOSE 61100

# Start the Node.js server
CMD ["node", "server.js"]
