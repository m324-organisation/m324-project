# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first for layer caching
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code to the container
COPY . .

# Expose port (optional, z.B. 3000 wenn dein Server darauf läuft)
EXPOSE 3000

# Start the server when the container starts
CMD ["npm", "start"]
