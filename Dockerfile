FROM node:22-alpine
WORKDIR /app

# Pre-built artifact from CI (dist/ + node_modules/ with --dereference)
COPY dist/       ./dist/
COPY node_modules/ ./node_modules/
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/src/main.js"]
