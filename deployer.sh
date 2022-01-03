#!/bin/bash
echo "CCUS-CM Deploy in progress..."
echo "Verifying prerequisites"
if [[ ! HOST ]]; then
  echo "Environment var HOST not found!"
  exit 1
elif [[ ! PORT ]]; then
  echo "Environment var PORT not found!"
  exit 1
elif [[ ! NODE_ENV ]]; then
  echo "Environment var NODE_ENV not found!"
  exit 1
elif [[ ! APP_KEY ]]; then
  echo "Environment var APP_KEY not found!"
  exit 1
elif [[ ! DRIVE_DISK ]]; then
  echo "Environment var DRIVE_DISK not found!"
  exit 1
elif [[ ! SESSION_DRIVER ]]; then
  echo "Environment var SESSION_DRIVER not found!"
  exit 1
elif [[ ! CACHE_VIEWS ]]; then
  echo "Environment var CACHE_VIEWS not found!"
  exit 1
elif [[ ! DB_CONNECTION ]]; then
  echo "Environment var DB_CONNECTION not found!"
  exit 1
elif [[ ! MYSQL_HOST ]]; then
  echo "Environment var MYSQL_HOST not found!"
  exit 1
elif [[ ! MYSQL_PORT ]]; then
  echo "Environment var MYSQL_PORT not found!"
  exit 1
elif [[ ! MYSQL_USER ]]; then
  echo "Environment var MYSQL_USER not found!"
  exit 1
elif [[ ! MYSQL_PASSWORD ]]; then
  echo "Environment var MYSQL_PASSWORD not found!"
  exit 1
elif [[ ! MYSQL_DB_NAME ]]; then
  echo "Environment var MYSQL_DB_NAME not found!"
  exit 1
else
  echo "Prerequesites were met :)"
fi
echo "################"
hide_output=$(npm install --no-optional)
echo "node version:"
node --version
echo "################"
echo "pm2 version:"
pm2 --version
echo "################"
echo "Building project"
hide_output=$(npm run build)
echo "Project builded at /build :)"
echo "################"
echo "Running project migrations"
ENV_SILENT=true node ace migration:run --force
echo "Migrations succeded :)"
echo "################"
echo "Magic happening"
hide_output=n$(npm ci --production)
echo "Spells worked as expected :)"
echo "################"
echo "Trying to run the app on the background"
hide_output=$(pm2 stop all)
hide_output=$(pm2 start "npm run start")
pm2 list
echo "Deploy succeded"
