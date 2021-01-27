#!/bin/bash

echo sudo docker-compose stop
sudo docker-compose stop

echo sudo docker-compose rm -f
sudo docker-compose rm -f

echo sudo docker-compose pull
sudo docker-compose pull

echo sudo docker-compose up -d
sudo docker-compose up -d

