# version: '3.1'
# services:
#   teamspeak:
#     image: teamspeak:3.13.7
#     depends_on:
#       - db
#     restart: always
#     volumes:
#       - /data/teamspeak:/var/ts3server/
#     ports:
#       - 9987:9987/udp
#       - 10011:10011
#       - 30033:30033
#     environment:
#       TS3SERVER_DB_PLUGIN: ts3db_mariadb
#       TS3SERVER_DB_SQLCREATEPATH: create_mariadb
#       TS3SERVER_DB_HOST: db
#       TS3SERVER_DB_USER: root
#       TS3SERVER_DB_PASSWORD: Q9DI@N!ONDSK!
#       TS3SERVER_DB_NAME: teamspeak
#       TS3SERVER_LICENSE: accept
#       TS3SERVER_LOG_APPEND: 0
#       TS3SERVER_DB_CONNECTIONS: 100
#       TS3SERVER_SERVERADMIN_PASSWORD: "@bcd!23A"
#     networks:
#       - teamspeak

#   db:
#     image: mariadb:10.8.2
#     restart: always
#     volumes:
#         - /data/mariadb:/var/lib/mysql
#     environment:
#       MYSQL_ROOT_PASSWORD: Q9DI@N!ONDSK!
#       MYSQL_DATABASE: teamspeak
#     networks:
#       - teamspeak

# networks:
#   teamspeak: