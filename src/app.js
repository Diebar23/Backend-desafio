import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import multer from "multer";
import session from "express-session";
import imageRouter from "./routes/image.router.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
const PUERTO = 8080;
import cors from "cors";
import "../src/database.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(express.static("./src/public"));
app.use(cookieParser());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
app.use(multer({storage}).single("image"));
app.use(cors());
//Session
app.use(session({
    secret:"mi_secreto",
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routing: 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.use("/", imageRouter);
app.use("/", viewsRouter);
app.use("/", sessionRouter);

//Listen
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);

});