#! /bin/bash

app_name=$1
if [ -z $app_name ]; then
    echo 'Please set app name'
    echo '$ ./build.sh XXXX'
    exit -1
fi
export APP_NAME=${app_name}
rm -rf ./.env
# Create or overwrite the .env file with the APP_NAME variable
if [ ! -d ./${app_name} ]; then
    echo "Please run:$ ./build.sh ${APP_NAME}"
    exit 0
fi

cp ./${app_name}/.env ./.env

docker compose up --build
rm -rf ./.env