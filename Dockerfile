# docker buildx build -t peeps . --load
# docker run --rm -p 8000:8000 -v `pwd`:/root -w /root peeps uvicorn main:app --reload

# docker login -u gregclinton
# docker tag peeps:latest gregclinton/peeps:latest
# docker push gregclinton/peeps

FROM ubuntu:22.04

RUN apt-get -y update

RUN apt -y install python3 python3-pip

RUN pip install openai langchain langchain-cli