#### Stage 1: Build the angular application
FROM node:18 as build

# Configure the main working directory inside the docker image.
# This is the base directory used in any further RUN, COPY, and ENTRYPOINT commands.
WORKDIR /app

# Copy the package.json as well as the package-lock.json and install
# the dependencies. This is a separate step so the dependencies
# will be cached unless changes to one of those two files are made.
COPY package*.json ./
RUN npm install

# Copy the main application
COPY . ./

# Set the API_BASE_URL as environment variable
# from docker-compose.yml file
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

# Replace the placeholder in environment.prod.ts during Docker build
RUN sed -i "s|http://localhost:8080|${API_BASE_URL}|g" src/environments/environment.prod.ts
RUN echo "Change API_BASE_URL to $API_BASE_URL in environment.prod.ts"

# Build the application
RUN npm run build --prod

#### Stage 2, use the compiled app, ready for production with Nginx
FROM nginx

# Copy the angular build from Stage 1
COPY --from=build /app/dist/out/ /usr/share/nginx/html

# Copy our custom nginx config
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the Docker host, so we can access it
# from the outside.
EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
