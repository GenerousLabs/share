#!/bin/bash

# Stop if any of the steps fail
set -e

# Source the file defined in ENV_FILENAME or fallback to .env
source "${ENV_FILENAME-.env}"

docker tag $DOCKER_REPO_NAME:latest $DOCKER_USER_NAME/$DOCKER_REPO_NAME
docker push $DOCKER_USER_NAME/$DOCKER_REPO_NAME:latest
