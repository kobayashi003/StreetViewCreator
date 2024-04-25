#! /bin/bash

app_name=$1
if [ -z $app_name ]; then
    echo 'Please set app name'
    echo '$ ./run.sh XXXX'
    exit -1
fi
export APP_NAME=${app_name}
# 指定のenvfileが存在しなければ
if [ ! -e ./${app_name}/.env ]; then
    # Create or overwrite the .env file with the APP_NAME variable
    echo "APP_NAME=${app_name}" > ./${app_name}/.env
    # Set the CLIENT_COMMAND variable and append it to the .env file
    echo "CLIENT_COMMAND=npm start" >> ./${app_name}/.env
    echo "SERVER_COMMAND=python3 server.py" >> ./${app_name}/.env
    echo "MMAND=pip install yahoo-fin " >> ./${app_name}/.env
    echo "NPM_COMMAND=npm install axios " >> ./${app_name}/.env
fi

if [ -e ./.env ]; then
  rm -rf ./.env
fi

cp ./${app_name}/.env ./

docker compose up

rm -rf ./.env