FROM node:18-slim

ARG USER_ID
ARG GROUP_ID

# Installing nginx
RUN apt-get update && apt-get -y install nginx sudo
RUN mkdir /var/www/public

# Create user / group
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
RUN addgroup --system --gid ${GROUP_ID} docker
RUN adduser --shell /bin/bash --system --home /project --ingroup docker --ingroup sudo -u ${USER_ID}  docker

USER docker

EXPOSE 80
WORKDIR /project
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
