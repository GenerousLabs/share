#!/bin/bash


STATUS=$(git status --porcelain | grep -c '^')

if [[ "$STATUS" != "0" ]]
then
  echo "Cowardly refusing to build with a dirty git #E2G2L0"
  exit 1
fi

set -e

export SHARE_VERSION=$(git rev-parse --short HEAD)
export NODE_ENV=production

echo "############################################################"
echo cat .env
cat .env
echo "############################################################"

read -p "Proceed with this .env? (press y to continue) " -n 1 -r
echo
if [[ "$REPLY" != "y" ]]
then
  echo "Okay, stopping now. #fwC6iB"
  exit 0
fi

set -a
source .env
set +a

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
