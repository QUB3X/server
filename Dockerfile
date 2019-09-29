# Choose image 
FROM node:12-alpine

# Create dir containing the app
WORKDIR /urs/src/app

COPY package*.json ./

RUN apk add --update nodejs npm

RUN npm install 
# --only=production

# Bundle app source
COPY . .

EXPOSE 50999-51100
CMD ["npm", "start"]
