# docker-uptime
An app monitoring platform written in Node.js and deployed on Docker

# How do I use it?

1. Clone the repo `git clone git@github.com:developius/docker-uptime.git`
2. Move into the repo `cd docker-uptime`
3. Install NPM modules `npm i`
4. Run the code `npm start`

# Docker builds
UI: `docker build -t talos-ui . -f Dockerfile.ui`
Monitor: `docker build -t talos-monitor . -f Dockerfile.monitor`
Alexa: `docker build -t talos-alexa . -f Dockerfile.alexa`

# Docker runs
Mongo:  `docker run --rm --name talos-mongo mongo`
UI: `docker run -d -p 3000:3000 --name talos-ui --link talos-mongo:mongo talos-ui`
Monitor: `docker run -d --name talos-monitor --link talos-mongo:mongo talos-monitor`
Alexa: `docker run -d -p 3001:3000 --name talos-alexa --link talos-mongo:mongo talos-alexa`