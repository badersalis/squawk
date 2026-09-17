# TODO(next): split into a build stage + a pruned runtime stage (the
# @squawk/search:prune Nx target already exists for this) once image size matters.
FROM node:22-bookworm-slim
WORKDIR /workspace

COPY package.json package-lock.json nx.json tsconfig.base.json tsconfig.json ./
COPY libs ./libs
# The whole apps/ tree, not just this service: the root tsconfig.json carries project
# references to every app, and Nx's sync-check fails if any referenced app is missing.
COPY apps ./apps

# TODO(next): switch to `npm ci` once the lockfile reliably records Linux-only
# optional deps from a Windows dev machine (npm ci fails on it; npm install doesn't).
RUN npm install
RUN npx nx build @squawk/search

ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "apps/search/dist/main.js"]
