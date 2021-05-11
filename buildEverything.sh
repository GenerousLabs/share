#!/bin/bash

STATUS=$(git status --porcelain | grep -c '^')

if [[ "$STATUS" != "0" ]]
then
  echo "Cowardly refusing to build with a dirty git #E2G2L0"
  exit 1
fi

# Stop if any of the steps fail
set -e

# Switch between production and staging based on git branch name
BRANCH=$(git branch --show-current)

if [[ "$BRANCH" != "production" ]]
then
  export ENV_FILENAME=".env.staging"
  # export NODE_ENV=staging
  echo "Building staging version"
else
  export ENV_FILENAME=".env"
  # export NODE_ENV=production
  echo "Building PRODUCTION version"
fi

export SHARE_VERSION=$(git rev-parse --short HEAD)

echo "############################################################"
echo cat "${ENV_FILENAME}"
cat "${ENV_FILENAME}"
echo "############################################################"

# set -a means that the FOO=bar declarations in .env are exported
set -a
source "${ENV_FILENAME}"
set +a

if [ -z ${NODE_ENV+x} ]
then
  echo
  echo "##### FATAL ERROR"
  echo
  echo "NODE_ENV is not set"
  exit
fi

if [ -z ${SHARE_HOSTNAME+x} ]
then
  echo
  echo "##### FATAL ERROR"
  echo
  echo "SHARE_HOSTNAME is not set"
  exit
fi

read -p "Proceed with this .env? (press y to continue) " -n 1 -r
echo
if [[ "$REPLY" != "y" ]]
then
  echo "Okay, stopping now. #fwC6iB"
  exit 0
fi

echo "############################################################"
echo "##### Building expo"
echo "############################################################"

echo cd expo
cd expo
echo "############################################################"
echo yarn build
yarn build
echo "############################################################"

echo "############################################################"
echo "##### Building website"
echo "############################################################"

echo cd ../website
cd ../website
echo "############################################################"

echo yarn build
yarn build
echo "############################################################"


echo "############################################################"
echo "##### Building server"
echo "############################################################"

echo cd ../server/
cd ../server/
echo "############################################################"

echo yarn copy
yarn copy
echo "############################################################"

echo ./buildDocker.sh
./buildDocker.sh
echo "############################################################"

read -p "Push to docker hub? " -n 1 -r
echo
if [[ "$REPLY" == "y" ]]
then
  echo ./pushDocker.sh
  ./pushDocker.sh
echo "############################################################"
fi
