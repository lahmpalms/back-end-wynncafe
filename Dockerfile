# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:16.15.0-alpine

# Create a working directory for the app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's files
COPY . .

# Set the app's environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose the port the app will listen on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
