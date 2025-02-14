API de GESTIÓN DE USUARIOS.

REQUISITOS PREVIOS.
Antes de correr el programa, debes asegurarte de tener instalado los siguiente en tu sistema:
    - Node.js (Version 14 o superior)
    - npm (Gestor de paquetes de Node.js)

INSTALACIÓN DE DEPENDENCIAS.
Para iniciar, debes de ejecutar el siguiente comando dentro de la terminal para instalar las dependencias necesarias.
    npm install

EJECUTAR EL SERVIDOR LOCALMENTE
Utiliza el siguiente comando para iniciar el servidor en la terminal bash.
    npm start

ACCEDER A LA DOCUMENTACIÓN SWAGGER
Una vez hayas iniciado el servidor, puedes acceder a la documentación ingresando a esta direccion:
    hhtp://localhost:3000/api-docs


REALIZAR PRUEBAS BÁSICAS DE LA API DESDE LA TERMINAL.

1.- Ingresar un usuario.
    En la terminal powershell ingresar la siguiente serie de comandos:

    Invoke-WebRequest -Uri "http://localhost:3000/usuarios" `
        -Method Post `
        -Headers @{ "Content-Type"="application/json" } `
        -Body '{"nombre":"Juan", "email":"juan@example.com", "edad":25}' `
        -UseBasicParsing

    Unicamente se adaptaran los datos de nombre, email y edad dependiendo de que es lo que se este buscando.

2.- Obtener todos los usuarios.
    En la terminal bash se ingresara la siguiente linea de comando:

    curl -X GET http://localhost:3000/usuarios

3.- Obtener usuario por ID.
    En la terminal bash se ingresara la siguiente linea de comando:

    curl.exe -X GET "http://localhost:3000/usuarios/1"

    Solo modificando el parametro final de acuerdo al numero de la ID de la persona deseada.

4.- Modificar usuario.
    En la terminal powershell ingresar la siguiente serie de comandos:

    Invoke-WebRequest -Uri "http://localhost:3000/usuarios/1" `
        -Method Put `
        -Headers @{ "Content-Type"="application/json" } `
        -Body '{"nombre": "Juan Lopez", "email": "juanlopez@example.com", "edad": 30}' `
        -UseBasicParsing

    Unicamente se adaptaran los datos de nombre, email y edad dependiendo de que es lo que se este buscando.

5.- Eliminar usuario.

    En la terminal bash se ingresara la siguiente linea de comando:

    curl.exe -X DELETE "http://localhost:3000/usuarios/1"

    Solo modificando el parametro final de acuerdo al numero de la ID de la persona deseada.


NOTA:
Los datos no se guardan de manera permanente, por lo que se borraran al cerrar el servidor. Esto es debido a que la API usa una base de datos en memoria.