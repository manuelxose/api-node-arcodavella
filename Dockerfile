# Stage 1: Build
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies)
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --production

# Copiar el código compilado desde el stage de build
COPY --from=builder /usr/src/app/dist ./dist

# Copiar archivos de configuración necesarios (si existen)
COPY --from=builder /usr/src/app/.env ./

# Exponer el puerto que usa tu aplicación (ajusta si es necesario)
EXPOSE 3000

# Definir variable de entorno para producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["node", "dist/app.js"]
