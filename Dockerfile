# Use Node.js LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose port (if needed by express or keep-alive)
EXPOSE 3000

# Start the bot
CMD ["pm2-runtime", "index.js"]
