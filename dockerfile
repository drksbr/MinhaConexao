FROM alpine:latest
RUN mkdir /app && adduser -h /app -D minhaconexao
WORKDIR /app
COPY --chown=minhaconexao minhaconexao .

EXPOSE 8080
CMD ["/app/minhaconexao"]