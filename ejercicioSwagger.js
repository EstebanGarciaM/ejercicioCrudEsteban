const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

app.use(express.json());

// Definir la configuración básica de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Versión de OpenAPI
    info: {
      title: "API Biblioteca",
      version: "1.0.0",
      description: "Una API para gestionar libros en una biblioteca",
    },
  },
  // Ruta donde se encuentran las especificaciones de Swagger
  apis: ["./index.js"], // Aquí indicas el archivo que contiene las rutas (puede ser index.js o el nombre de tu archivo)
};

// Crear el objeto Swagger con la configuración
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Montar Swagger UI para ver la documentación interactiva
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let biblioteca = [];

/**
 * @swagger
 * /biblioteca:
 *   post:
 *     summary: Añadir un libro a la biblioteca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               precio:
 *                 type: number
 *               urlPortada:
 *                 type: string
 *     responses:
 *       201:
 *         description: Libro añadido
 *       400:
 *         description: Datos incorrectos
 */
app.post("/biblioteca", (req, res) => {
  const nuevoLibro = {
    titulo: req.body.titulo,
    autor: req.body.autor,
    isbn: req.body.isbn,
    precio: req.body.precio,
    urlPortada: req.body.urlPortada,
  };

  biblioteca.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

/**
 * @swagger
 * /biblioteca:
 *   get:
 *     summary: Obtener todos los libros de la biblioteca
 *     responses:
 *       200:
 *         description: Lista de libros
 */
app.get("/biblioteca", (req, res) => {
  res.json(biblioteca);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   get:
 *     summary: Obtener un libro por su ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         description: ISBN del libro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro encontrado
 *       404:
 *         description: No se encontró el libro
 */
app.get("/biblioteca/:isbn", (req, res) => {
  const item = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!item) return res.status(404).send("No se ha encontrado el libro.");
  res.json(item);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   put:
 *     summary: Modificar los datos de un libro por su ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         description: ISBN del libro
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               precio:
 *                 type: number
 *               urlPortada:
 *                 type: string
 *     responses:
 *       200:
 *         description: Libro actualizado
 *       404:
 *         description: No se encontró el libro
 */
app.put("/biblioteca/:isbn", (req, res) => {
  const item = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!item) return res.status(404).send("No se ha encontrado el libro.");

  item.titulo = req.body.titulo;
  item.autor = req.body.autor;
  item.isbn = req.body.isbn;
  item.precio = req.body.precio;
  item.urlPortada = req.body.urlPortada;

  res.json(item);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   delete:
 *     summary: Eliminar un libro por su ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         description: ISBN del libro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro eliminado
 *       404:
 *         description: No se encontró el libro
 */
app.delete("/biblioteca/:isbn", (req, res) => {
  const itemIsbn = biblioteca.findIndex((i) => i.isbn === req.params.isbn);
  if (itemIsbn === -1)
    return res.status(404).send("No se ha encontrado el libro.");

  const deletedItem = biblioteca.splice(itemIsbn, 1);

  res.json(deletedItem[0]);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
