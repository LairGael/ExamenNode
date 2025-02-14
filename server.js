const express = require('express');
const { body, validationResult } = require('express-validator');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;
app.use(express.json());

let usuarios = [];
let idCounter = 1;

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Gestión de Usuarios",
            version: "1.0.0",
            description: "Documentación de la API RESTful de gestión de usuarios",
        },
    },
    apis: ["./server.js"], // Cambia esto según el nombre de tu archivo
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         edad:
 *           type: integer
 *           description: Edad del usuario
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 */
app.post('/usuarios', [
    body('nombre').notEmpty().withMessage('Nombre de usuario obligatorio'),
    body('email').isEmail().withMessage('Por favor, ingrese un correo electrónico válido')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { nombre, email, edad } = req.body;
    if (usuarios.some(user => user.email === email)) {
        return res.status(400).json({ error: 'El correo ingresado ya está en uso' });
    }

    const nuevoUsuario = { id: idCounter++, nombre, email, edad };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
app.get('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Modificar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */
app.put('/usuarios/:id', [
    body('nombre').optional().notEmpty().withMessage('Nombre de usuario obligatorio'),
    body('email').optional().isEmail().withMessage('Por favor, ingrese un correo electrónico válido')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nombre, email, edad } = req.body;
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (edad) usuario.edad = edad;

    res.json(usuario);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
app.delete('/usuarios/:id', (req, res) => {
    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuarios.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
