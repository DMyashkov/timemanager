# Base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Expose Metro Bundler port
EXPOSE 8081

# Start Metro Bundler
CMD ["yarn", "start"]

