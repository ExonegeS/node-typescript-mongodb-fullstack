# Use a node image to install and run http-server
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json (if you have it) and install dependencies
COPY package*.json ./

RUN npm install

# Copy all frontend files into the container
COPY . .

# Install http-server globally (if it's not already in package.json)
RUN npm install -g http-server

# Expose the port where the frontend will be served
EXPOSE 3000

# Start the server (http-server will serve the static files on port 3000)
CMD ["http-server", ".", "-p", "3000"]
