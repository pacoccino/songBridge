#!/usr/bin/env bash

apt-get update
apt-get install -y git curl

curl -fsSL https://get.docker.com/ | sh

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install -g pm2

./dockinstall.sh