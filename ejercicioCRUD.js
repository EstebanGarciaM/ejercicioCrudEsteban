const express = require("express");
const app = express();

app.use(express.json());

let biblioteca = [];

//Anadir libro a la biblioteca
app.post("/biblioteca",(req,res) => {
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

//Leer todos los libros de la biblioteca
app.get("/biblioteca", (req, res) => {
    res.json(biblioteca);
});

//Buscar un libro por su ISBN y mostrar los datos
app.get("/biblioteca/:isbn", (req,res)  => {
    const item = biblioteca.find((i) => i.isbn === req.params.isbn);
    if (!item) return res.status(404).send("No se ha encontrado el libro.");
    res.json(item);
});

//Modificar los datos de un libro por su isbn
app.put("/biblioteca/:id",(req,res) => {
    const item = biblioteca.find((i) => i.isbn ===req.params.isbn);
    if (!item) return res.status(404).send("No se ha encontrado el libro.");

    item.titulo = req.body.titulo;
    item.autor = req.body.autor;
    item.isbn = req.body.isbn;
    item.precio = req.body.precio;
    item.urlPortada = req.body.urlPortada;

    res.json(item);
});

//Borrar un libro por su isbn
app.delete("/biblioteca/:isbn", (req,res) => {
    const itemIsbn = biblioteca.findIndex((i) => i.isbn === parseInt(req.params.isbn));
    if (itemIsbn === -1)
        return res.status(404).send("No se ha encontrado el libro.");

    const deletedItem = biblioteca.splice(itemIsbn,1);

    res.json(deletedItem[0]);
});

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");

});