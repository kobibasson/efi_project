FROM centos:latest
# Do not use node official image due to Tshark dependency problems
WORKDIR /usr/app

ENV NODE_ENV=production
ENV http_proxy=http://proxy:8080
ENV https_proxy=http://proxy:8080

RUN yum install -y gcc-c++ make openssh-server openssh-clients wireshark
RUN curl -sL --proxy http://proxy:8080 https://rpm.nodesource.com/setup_12.x | bash -
RUN yum install -y nodejs

COPY package*.json ./
COPY ./client/package*.json ./client/
RUN npm config set proxy http://proxy:8080
RUN npm config set https-proxy http://proxy:8080
RUN npm install

COPY . .

RUN npm install --prefix client
RUN npm run build --prefix client

EXPOSE 80 443 8443

CMD ["npm", "start"]