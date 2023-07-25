#!/bin/bash

# Esperar a que el servicio de MongoDB esté disponible
until mongo --host localhost --eval "print(\"Conexión exitosa a MongoDB\")"; do
    sleep 1
done

# Crear la base de datos y la colección
mongo --host localhost <<EOF
use Restaurant;
db.createCollection("restaurants");
EOF

# Importar datos en la colección 'restaurants' desde el archivo restaurants.bson.gz
mongorestore --gzip --archive=restaurants.bson.gz --db=Restaurant --collection=restaurants

# Crear el usuario root:example con roles de lectura y escritura sobre la base de datos 'Restaurant'
mongo --host localhost <<EOF
use admin;
db.createUser({
    user: "root",
    pwd: "example",
    roles: [{ role: "readWrite", db: "Restaurant" }]
});
EOF

# Detener el servicio de MongoDB para evitar conexiones no autorizadas después de la configuración
mongo --eval "db.getSiblingDB('admin').shutdownServer()"

echo "Configuración completada. MongoDB se detendrá automáticamente."
