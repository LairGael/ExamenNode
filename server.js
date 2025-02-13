const express = require('express');
const {body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;
app.use(express.json());

let usuarios = [];
let idCounter = 1;

//Definiendo ruta
app.get('/', (req, res) => {
    res.send(`
        <h1>Bienvenido a la API de Gestión de Usuarios</h1>
        <p>Para interactuar con la API, usa Postman o cURL.</p>
        <p>Endpoint disponibles:</p>
        <ul>
            <li>GET /usuarios - Listar usuarios</li>
            <li>POST /usuarios - Crear usuario</li>
            <li>GET /usuarios/:id - Obtener usuario por ID</li>
            <li>PUT /usuarios/:id - Actualizar usuario</li>
            <li>DELETE /usuarios/:id - Eliminar usuario</li>
        </ul>
    `);
});


//Validación de Email
const validacionEmail = (req, res, next) => {
    const { email } = req.body;
    if (usuarios.some(user => user.email === email)){
        return res.status(400).json({error: 'El correo ingresado ya esta en uso'})
    }
    next();
}

//Creación de usuarios
app.post('/usuarios', [
    body('nombre').notEmpty().withMessage('Nombre de Usuario Obligatorio'),
    body('email').isEmail().withMessage('Por favor, ingrese un correo electronico valido')
],validacionEmail, (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array()});
    }
    
    const {nombre, email, edad} = req.body;
    const nuevoUsuario = {id: idCounter++, nombre, email, edad};
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// Mostrar usuarios.
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
})

//Mostrar usuarios por ID
app.get('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario){
        return res.status(404).json({error: 'Usuario no encontrado'});
    }
    res.json(usuario);
})

//Actualizar usuario
app.put('/usuarios/:id', [
    body('nombre').optional().notEmpty().withMessage('Nombre de usuario obligatorio'),
    body('email').optional().isEmail().withMessage('Por favor, ingrese un correo electronico valido')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array() });
    }

    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario){
        return res.status(404).json({error: 'Usuario no encontrado'});
    }

    const {nombre, email, edad} = req.body;
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (edad) usuario.edad = edad;

    res.json(usuario);
});

//Eliminar usuario
app.delete('/usuarios/:id', (req, res) => {
    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if(index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado'});
    }
    usuarios.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});