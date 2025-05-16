FROM nginx:stable

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

COPY ./default.${APP_ENV}.conf /etc/nginx/conf.d/default.conf