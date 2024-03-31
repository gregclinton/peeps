# sudo docker buildx build -t peeps . --load
# sudo docker login -u gregclinton
# sudo docker tag peeps:latest gregclinton/peeps:latest
# sudo docker push gregclinton/peeps

FROM ubuntu:22.04

RUN apt-get -y update

RUN apt -y install python3 python3-pip

RUN pip install openai flask

CMD echo peeps