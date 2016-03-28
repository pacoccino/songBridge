mkdir -p ../data/mongo

docker kill sb-mongo
docker rm sb-mongo
docker run --name sb-mongo -d \
        -p 172.17.0.1:15011:27017 \
        -v ../data/mongo:/data/db \
        mongo:latest

docker kill sb-redisdocker
docker rm sb-redis
docker run --name sb-redis -d \
        -p 172.17.0.1:15021:6379 \
        redis:latest
