#!/bin/bash

export VERSION=$(git rev-parse --short HEAD)
export NODE_ENV=production

expo publish
