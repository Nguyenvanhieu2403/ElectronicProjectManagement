@echo off

docker build -f Dockerfile -t hub-docker.vnpost.vn/oeweb/vnpost.client:oe1.0 .
docker push hub-docker.vnpost.vn/oeweb/vnpost.client:oe1.0

pause