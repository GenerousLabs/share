#!/bin/bash

source .env

docker tag $DOCKER_REPO_NAME:latest $DOCKER_USER_NAME/$DOCKER_REPO_NAME
docker push $DOCKER_USER_NAME/$DOCKER_REPO_NAME:latest
