FROM node:20-alpine

WORKDIR /app


COPY package*.json ./

RUN npm install

# Copy source after dependencies are installed
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]