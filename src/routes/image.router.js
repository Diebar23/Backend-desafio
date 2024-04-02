import { Router } from "express";
import ImageModel from "../dao/models/image.js";
import {promises as fs} from "fs";
const router = Router();

//Ruta raíz de la aplicación

router.get("/", async (req, res) => {
    const images = await ImageModel.find();

    const newArrayImages = images.map( image => {
        return {
            id: image._id,
            title: image.title,
            description: image.description,
            filename: image.filename,
            path: image.path
        }
    })

    res.render("index", {images: newArrayImages, user: req.session.user});
})

//Ruta para acceder al formulario de carga

router.get("/upload", (req, res) => {
    res.render("upload");
})


//Ruta upload, para subir imagenes con multer

router.post("/upload", async (req, res) => {
    try {
        const image = new ImageModel();
        image.title = req.body.title;
        image.description = req.body.description;
        image.filename = req.file.filename;
        image.path = "/img/" + req.file.filename;

        //Guardamos el objeto en la base de datos
        await image.save();

        res.redirect("/");
    } catch (error) {
        res.status(500).send({message: "Error del servidor"});
    }
})

//Ruta para eliminar una imagen 

const requireAuth = (req, res, next) => {
    if(req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get("/image/:id/delete", requireAuth, async (req, res) => {
    const {id} = req.params;
    const image = await ImageModel.findByIdAndDelete(id);
    await fs.unlink("./src/public" + image.path);
    res.redirect("/");
})

export default router;


