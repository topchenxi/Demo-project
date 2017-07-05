#!/bin/sh

export PATH=/usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/app/deploy/jdk1.7.0_75/bin:/usr/local/bin/node:/usr/local/bin:/app/deploy/maven/bin:/root/bin:/usr/local/bin/gulp:/usr/local/bin/npm

cnpm install

#npm run build
node ./build/build.js
