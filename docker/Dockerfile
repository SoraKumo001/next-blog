FROM node:alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 yarn
COPY . .
RUN yarn build && \
  cp -r -u .next/server .next/standalone/.next && \
  cp -r -u .next/static .next/standalone/.next && \
  cp -r -u public .next/standalone

FROM node:alpine
WORKDIR /app
COPY --from=build /app/.next/standalone ./

EXPOSE 3000
CMD ["node","server.js"]
