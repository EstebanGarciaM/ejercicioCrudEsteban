const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://estebangarcia:biblioteca1@biblioteca.belic.mongodb.net/?retryWrites=true&w=majority&appName=Biblioteca",{});

//Definimos el esquema de libro
const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    isbn: { type: Number, required: true, unique: true },
    precio: { type: Number, required: true },
    urlPortada: { type: String, required: true }
});

//Definimos el modelo de libro
const Libro = mongoose.model("Libro",libroSchema);

//Ruta para anadir libro a la biblioteca
app.post("/biblioteca", async (req,res) => {
    try{
        const nuevoLibro = new Libro({
            titulo: req.body.titulo,
            autor: req.body.autor,
            isbn: req.body.isbn,
            precio: req.body.precio,
            urlPortada: req.body.urlPortada,
        });
        await nuevoLibro.save();
        res.status(201).json(nuevoLibro);
    } catch(err) {
        res.status(400).send(err.message);
    }
});


//Leer todos los libros de la biblioteca
app.get("/biblioteca", async (req, res) => {
    try{
        const biblioteca = await Libro.find();
        res.json(biblioteca);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Buscar un libro por su ISBN y mostrar los datos
app.get("/biblioteca/:isbn", async (req,res)  => {
    try {
        const libro = await
        Libro.findOne({isbn: req.params.isbn});
        if(!libro) return res.status(400).send("No se ha encontrado el libro.");
        res.json(libro);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Modificar los datos de un libro por su isbn
app.put("/biblioteca/:isbn", async (req,res) => {
    try {
        const libro = await Libro.findOne({isbn :req.params.isbn});
        if (!libro) return res.status(404).send("No se ha encontrado el libro.");

        libro.titulo = req.body.titulo;
        libro.autor = req.body.autor;
        libro.isbn = req.body.isbn;
        libro.precio = req.body.precio;
        libro.urlPortada = req.body.urlPortada;

        await libro.save();
        res.json(libro);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//Borrar un libro por su isbn
app.delete("/biblioteca/:isbn", async (req,res) => {
    try{
        const libro = await Libro.findOneAndDelete({isbn: req.params.isbn});
        if (!libro) return res.status(404).send("No se ha encontrado el libro.");
        res.json(libro);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");

});