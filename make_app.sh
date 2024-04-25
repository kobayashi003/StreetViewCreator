#! /bin/bash

app_name=$1
if [ -z $app_name ]; then
    echo 'Please set app name'
    echo '$ ./make_app.sh XXXX'
    exit -1
fi
if [ -d ./${app_name} ]; then
    echo "dir exist: ${app_name}"
    exit 0
fi

mkdir -p ./${app_name}/server ./${app_name}/client
cp ./server-docker/server.py ./${app_name}/server
cp ./client-docker/package.json ./client-docker/tsconfig.json ./${app_name}/client
cp -r ./client-docker/src ./client-docker/public ./${app_name}/client

export APP_NAME=${app_name}
# Create or overwrite the .env file with the APP_NAME variable
echo "APP_NAME=${app_name}" > ./${app_name}/.env
# Set the CLIENT_COMMAND variable and append it to the .env file
# echo "PIP_COMMAND=pip install numpy opencv-python" >> .//.env
echo "PIP_COMMAND=pip install pip-review && opencv-python" >> ./${app_name}/.env
echo "CLIENT_COMMAND=npm install && npm install axios && npm start" >> ./${app_name}/.env
echo "SERVER_COMMAND=python3 server.py" >> ./${app_name}/.env

cp ./${app_name}/.env ./.env
docker compose up --build
rm -rf ./.env