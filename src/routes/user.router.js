import express from "express";
const router = express.Router();
import UserModel from "../models/user.model.js";
import { createHash } from "../utils/hashbcrypt.js";
import passport from "passport";
import generateToken from "../utils/jsonwebtoken.js";

//Registro con JSON Web Token:

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 
    try {
        const existingUser = await UserModel.findOne({email:email});
        if(existingUser) {
            return res.status(400).send({error: "El email ya esta en uso"});
        }

        //Crear un usuario nuevo: 
        const newUser = await UserModel.create({first_name, last_name, email, password:createHash(password), age});

        //Generar un token: 
        const token = generateToken({id: newUser._id});

        res.status(200).send({status:"success", message: "Usuario creado con éxito",  token});
        
    } catch (error) {
        console.log("Error en al autenticación", error);
        res.status(500).send({status: "error", message: "Error interno del servidor"});
    }
})


// //con passport

// router.post("/", passport.authenticate("register", {
//     failureRedirect: "/failedregister"
// }), async (req, res) => {
//     if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email
//     };

//     req.session.login = true;

//     res.redirect("/profile");
// })

// router.get("/failedregister", (req, res) => {
//     res.send({error: "Registro fallido"});
// })

export default router;