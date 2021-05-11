#!/bin/bash

# Stop if any of the steps fail
set -e

# Source the file defined in ENV_FILENAME or fallback to .env.staging
source "${ENV_FILENAME-.env.staging}"

docker tag $DOCKER_REPO_NAME:latest $DOCKER_USER_NAME/$DOCKER_REPO_NAME
docker push $DOCKER_USER_NAME/$DOCKER_REPO_NAME:latest
