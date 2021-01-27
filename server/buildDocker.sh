#!/bin/bash

source .env

OS=$(uname -s)

if [ "$OS" = "Darwin" ]; then
  docker build -t "$DOCKER_REPO_NAME" .
else
  sudo docker build -t "$DOCKER_REPO_NAME"  .
fi