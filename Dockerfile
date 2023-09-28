FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=swift
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

COPY ./create_tables.sql /docker-entrypoint-initdb.d/create_tables.sql