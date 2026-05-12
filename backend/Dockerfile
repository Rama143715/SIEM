FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY src ./src
EXPOSE 3001
EXPOSE 514/udp
CMD ["npm", "run", "start"]