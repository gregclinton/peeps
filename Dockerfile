# docker buildx build -t peeps . --load
# docker run --rm -v `pwd`:/root -w /root peeps ls index.html

# docker login -u gregclinton
# docker tag peeps:latest gregclinton/peeps:latest
# docker push gregclinton/peeps

FROM ubuntu:22.04

RUN apt-get -y update

RUN apt -y install python3 python3-pip

RUN pip install openai langchain langchain-cli