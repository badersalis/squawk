# TODO(next): split into a build stage + a pruned runtime stage (the
# @squawk/schedule:prune Nx target already exists for this) once image size matters.
FROM node:22-bookworm-slim
WORKDIR /workspace

COPY package.json package-lock.json nx.json tsconfig.base.json tsconfig.json ./
COPY libs ./libs
COPY apps/schedule ./apps/schedule

# TODO(next): switch to `npm ci` once the lockfile reliably records Linux-only
# optional deps from a Windows dev machine (npm ci fails on it; npm install doesn't).
RUN npm install
RUN npx nx build @squawk/schedule

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/schedule/dist/main.js"]
