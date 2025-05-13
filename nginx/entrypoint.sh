#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  cp /etc/nginx/conf.d/default.prod.conf /etc/nginx/conf.d/default.conf
else
  cp /etc/nginx/conf.d/default.dev.conf /etc/nginx/conf.d/default.conf
fi

nginx -g 'daemon off;'
