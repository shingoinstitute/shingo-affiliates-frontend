#!/bin/bash

TAG="${TAG:-latest}"
IMG_NAME="shingo-affiliates"

HELP="USAGE: build.sh [OPTIONS] [-- DOCKER_ARGS]
Build and optionally push an image
Accepts all arguments that 'docker build' accepts

POSITIONAL ARGUMENTS:
    DOCKER_ARGS     Arguments to be passed to the docker build command
                      Must be separated from other arguments by --

OPTIONS:
    -e|--env        Specify env file
    -t|--tag TAG    Set image tag
    -p|--push       Push image to registry after build
    -ng|--no-github Don't automatically push changes to github
    -h|--help       Show this
"

build() {
    if [[ -f .env ]]; then
        TEMP=$(mktemp)
        mv .env "$TEMP"
    fi
    if [[ -f "$ENV_FILE" ]]; then
        cp "$ENV_FILE" .env
    fi

    docker build --tag docker.shingo.org/"$IMG_NAME":"$TAG" "$@" .
    if [[ "$PUSH" = true ]]; then
        docker login docker.shingo.org
        docker push docker.shingo.org/"$IMG_NAME":"$TAG"
    fi
    if [[ "$GITHUB" = true ]]; then
        git push
    fi

    if [[ -f "$TEMP" ]]; then
        mv "$TEMP" .env
    fi
}

read_build_args() {
    while [[ $# -gt 0 ]]; do
        BUILD_ARGS+=("$1")
        shift
    done
}

PUSH=false
GITHUB=true
BUILD_ARGS=()
while [[ $# -gt 0 ]]; do
    arg="$1"
    case $arg in
        -e|--env)
            shift
            ENV_FILE="$1"
            ;;
        -p|--push)
            PUSH=true
            ;;
        -ng|--no-git)
            GITHUB=false
            ;;
        -t|--tag)
            shift
            TAG="$1"
            ;;
        -h|--help)
            echo "$HELP"
            exit 0
            ;;
        --)
            shift
            read_build_args "$@"
            shift $#
            ;;
        *)
            echo "$HELP"
            exit 1
            ;;
    esac
    shift
done

build "${BUILD_ARGS[@]}"
