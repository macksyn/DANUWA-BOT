FROM node:20

WORKDIR /app

COPY . .

# Install dependencies AND pm2 globally
RUN npm install && npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]
