#!/bin/bash

STATUS=$(git status --porcelain | grep -c '^')

if [[ STATUS != "0" ]]
then
  echo $STATUS
  echo "Cowardly refusing to build with a dirty git"
  exit 1
fi

source .env

OS=$(uname -s)

if [ "$OS" = "Darwin" ]; then
  docker build -t "$DOCKER_REPO_NAME" .
else
  sudo docker build -t "$DOCKER_REPO_NAME"  .
fi