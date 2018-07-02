#!/bin/bash

TAG="${TAG:-latest}"
NETWORK="${NETWORK:-shingo-net}"
IMG_NAME="shingo-affiliates"
CONT_NAME="shingo-affiliates"
PORT=${PORT:-80}

if [[ "$TAG" = "test" ]]; then
  CONT_NAME+="-test"
fi

NAME="${NAME:-$CONT_NAME}"

docker run -itd                     \
    --name "$NAME"                  \
    --network "$NETWORK"            \
    --publish "$PORT":80            \
    docker.shingo.org/"$IMG_NAME":"$TAG"
