#!/usr/bin/env bash

apt-get update
apt-get install -y git curl

curl -fsSL https://get.docker.com/ | sh

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install -g pm2

mkdir -p /vagrant/data/mongo

docker run --name sb-mongo -d -p 27017:27017 mongo:latest

docker run --name sb-redis -d -p 6379:6379 redis:latest

docker run --name etcd -d -P quay.io/coreos/etcd:v2.3.1