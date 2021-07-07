#กำหนด image เป็น Linux ที่ทำงานอยู่บน Version Apline
FROM node:14
# FROM node:14-alpine
# เปลี่ยน dir ไว้ที่ usr app
ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
#  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
#  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
# RUN set -x \
#  && apk update \
#  && apk upgrade \
#  # replacing default repositories with edge ones
#  \
#  # Add the packages
#  && apk add --no-cache dumb-init curl make gcc g++ python3 linux-headers binutils-gold gnupg libstdc++ nss chromium \
#  \
#  && npm install puppeteer@0.13.0 \
#  \
#  # Do some cleanup
#  && apk del --no-cache make gcc g++ python3 binutils-gold gnupg libstdc++ \
#  && rm -rf /usr/include \
#  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
#  && echo
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh \
     && apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libasound2 libatk1.0-0 libgtk-3-0

WORKDIR /app

#Entry Point

COPY ./package*.json ./
#copy file [เริ่มต้น] => [สิ้นสุด] เอาไฟล์ทั้งหมดไป
RUN npm install
COPY ./ ./
ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV TZ='Asia/Bangkok'
EXPOSE 8802
#หลังจาก install แล้วก็จะทำการ เริ่มโปรแกรม
CMD ["npm","run","start"]
