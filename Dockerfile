FROM node:alpine
WORKDIR /spin/tgdiscord/app
COPY . .
RUN npm install
ENV NODE_ENV=production
CMD ["node", "index.js"]