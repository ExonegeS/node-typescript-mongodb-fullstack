# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Copy the views directory to the dist directory
RUN cp -r ./src/views ./dist/views

RUN cp -r ./src/public ./dist/public

# Expose the port the app runs on
EXPOSE ${BACKEND_PORT}

# Start the application
CMD ["node", "dist/index.js"]
