FROM dgarros/tcpreplay

WORKDIR /root/

ENV NODE_ENV=production
ENV http_proxy=http://proxy:8080
ENV https_proxy=http://proxy:8080

RUN apt-get update
RUN apt-get install -y arping netcat openssh-server iputils-ping

RUN echo 'user:pass' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

RUN sed 's@session\\s*required\\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

RUN mkdir /root/uploads

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]