# docker buildx build -t peeps . --load
# docker run --rm -p 443:443 -v `pwd`:/root -w /root peeps uvicorn main:app --host 0.0.0.0 --port 443 --ssl-keyfile=/etc/ssl/private/key.pem --ssl-certfile=/etc/ssl/certs/cert.pem --reload
# udo ufw allow 443
# sudo hostname -I | cut -d' ' -f1

# docker login -u gregclinton
# docker tag peeps:latest gregclinton/peeps:latest
# docker push gregclinton/peeps

FROM ubuntu:22.04

RUN apt-get -y update

RUN apt -y install python3 python3-pip

RUN pip install openai langchain langchain-cli

RUN pip install anthropic mistralai langchain-openai

RUN pip install -q -U google-generativeai

RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/key.pem -out /etc/ssl/certs/cert.pem -days 365 -nodes -subj "/CN=greg.com"