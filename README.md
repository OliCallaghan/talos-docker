# Talos
An app monitoring platform written in Node.js and deployed on Docker

# How do I use it?

Docker Compose: `docker-compose build`

You don't need to do the below if you're using Docker Composer.
- UI: `docker build -t talos-ui . -f Dockerfile.ui`
- Monitor: `docker build -t talos-monitor . -f Dockerfile.monitor`
- Alexa: `docker build -t talos-alexa . -f Dockerfile.alexa`

# Docker runs

Docker Compose: `docker-compose up`

You don't need to do the below if you're using Docker Composer.
- Mongo:  `docker run -d --name talos-mongo mongo`
- UI: `docker run -d -p 3000:3000 --name talos-ui --link talos-mongo:mongo talos-ui`
- Monitor: `docker run -d --name talos-monitor --link talos-mongo:mongo talos-monitor`
- Alexa: `docker run -d -p 3001:3000 --name talos-alexa --link talos-mongo:mongo talos-alexa`
