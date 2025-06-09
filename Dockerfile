# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first for layer caching
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
