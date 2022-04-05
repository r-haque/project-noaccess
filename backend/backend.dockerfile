FROM node:17-alpine

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json /app

# Install node packages
RUN npm install

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . /app

# Expose $PORT on container.
# We use a varibale here as the port is something that can differ on the environment.
EXPOSE 4000

# Start the app
CMD [ "nodemon", "app.js" ]