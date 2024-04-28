const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");

const PUERTO = 8080;
require("./database.js");

const { Pool } = require("pg");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const errorManager = require("./middleware/error.js");

const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(express.static("./src/public"));


//Passport
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();


//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routing: 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

app.use("/users", userRouter);
app.use(errorManager)

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);


//loggger

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'usuario',
    password: 'coderhouse',
    port: 5432, // El puerto predeterminado de PostgreSQL es 5432
});

//Crear Usuario: 
app.post('/users', async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, direccion, telefono } = req.body;

    try {
        const result = await pool.query('INSERT INTO users (nombre, apellido, fecha_nacimiento, direccion, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nombre, apellido, fecha_nacimiento, direccion, telefono]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error del servidor');
    }
});


//Obtener los usuarios

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error del servidor');
    }
});

//Obtener usuario por ID: 

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener Usuario:', error);
        res.status(500).send('Error del servidor');
    }
});

//Actualizar usuario por ID: 
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, fecha_nacimiento, direccion, telefono } = req.body;

    try {
        const result = await pool.query('UPDATE users SET nombre = $1, apellido = $2, fecha_nacimiento = $3, direccion = $4, telefono = $5 WHERE id = $6 RETURNING *', [nombre, apellido, fecha_nacimiento, direccion, telefono, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'usuario actualizado exitosamente', updatedUser: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error del servidor');
    }
});

//Eliminar usuario por ID: 
app.delete('/Users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query('DELETE FROM Users WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente', deletedUser: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error del servidor');
    }
});

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);

});

///Websockets: 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);