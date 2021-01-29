# FROM node:14-buster-slim AS base

FROM node:14-buster as builder

WORKDIR /usr/src/

# Copy all the code that we need in order to build
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY src src
COPY tsconfig.json tsconfig.json
COPY .eslintrc .eslintrc

# Install all of the required dependencies, including dev dependencies, inside
# the builder container
RUN yarn install

# Run the build command to build into dist/
RUN yarn build

# ------------------------------------------------------------------------------
# From builder to production image
# ------------------------------------------------------------------------------

# Start over with a clean build
# NOTE: We can't use the `-slim` container here as we need `git` which is not
# included in the slim containers.
FROM node:14-buster

WORKDIR /usr/src/

# We only need to copy the dist directory from the builder
COPY --from=builder /usr/src/dist/ ./dist/

# # Expose the port we use
# EXPOSE 14000

CMD [ "node", "dist/" ]
