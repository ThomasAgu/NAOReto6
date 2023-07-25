FROM node:16
WORKDIR /app

COPY package*.json . 

RUN npm install 

COPY . .


EXPOSE 3000

# Establecer el comando por defecto para el contenedor usando bash para ejecutar múltiples comandos
CMD [ "node", "index.js" ]