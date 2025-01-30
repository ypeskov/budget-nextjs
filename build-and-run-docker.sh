#!/bin/bash

docker rm -f budgeter

set -a
source <(grep -v '^#' .env.docker | awk -F= '{print $1"="$2}' | sed 's/ *= */=/g' | tr -d '\r')
set +a

docker build --no-cache -t budgeter .

docker run --rm -p 3000:3000 --env-file .env.docker --name budgeter budgeter