# Use Node 20 because package.json requires it
FROM node:20-alpine

# Create working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

# App port
EXPOSE 3000

# Start server
CMD ["npm", "start"]