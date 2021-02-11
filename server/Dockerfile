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
# We start again from the `-slim` container here, which we can't use for
# building, as it doesn't have all the required build dependencies.
FROM node:14-buster-slim

# Add git to our slim container, it's not included by default
RUN apt-get -y update
RUN apt-get -y install git

WORKDIR /usr/src/

# We only need to copy the dist directory from the builder
COPY --from=builder /usr/src/dist/ ./dist/

# Copy our built assets from other parts of the project
COPY built built

# # Expose the port we use
# EXPOSE 14000

CMD [ "node", "dist/" ]
