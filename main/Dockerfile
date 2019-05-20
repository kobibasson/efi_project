FROM centos:latest
# Do not use node official image due to Tshark dependency problems
WORKDIR /usr/app

ENV NODE_ENV=production

RUN yum install -y gcc-c++ make openssh-server openssh-clients wireshark && \
    curl -sL https://rpm.nodesource.com/setup_12.x | bash - && \
    yum install -y nodejs

COPY package*.json ./
COPY ./client/package*.json ./client/
RUN npm install

COPY . .

RUN npm install --prefix client && \
    npm run build --prefix client

EXPOSE 80 443 8443

CMD ["npm", "start"]