import express from "express";
const router = express.Router();
import UserModel from "../dao/models/user.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";
import generateToken from "../utils/jsonwebtoken.js";

//Login con JSON Web Token

// router.post("/login", async (req, res) => {
//     const {email, password} = req.body; 
//     try {
//         const user = await UserModel.findOne({email:email});

//         if(!user) {
//             return res.status(400).send({status:"error", message: "Usuario desconocido?"});
//         }

//         if(!isValidPassword(password, user)){
//             return res.status(400).send({status: "error", message: "Credenciales invalidas"});
//         }

//         //Si la contraseña es correcta, generamos el token. 
//         const token = generateToken({
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             id: user._id
//         });

//         res.send({status:"success", token});
        
//     } catch (error) {
//         console.log("Error en al autenticación", error);
//         res.status(500).send({status: "error", message: "Error interno del servidor"});
//     }
// })



//Logout

// router.get("/logout", (req, res) => {
//     if (req.session.login) {
//         req.session.destroy();
//     }
//     res.redirect("/login");
// })

//Ruta para registro de usuarios

router.post("/register", passport.authenticate("register"), async (req, res) => {
    if(!req.user) return res.status(401).send({message:"Credenciales invalidas"});

    req.session.user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }

    req.session.login = true; 

    res.redirect("/");
})

//Ruta para el login

router.post("/login", passport.authenticate("login"), (req, res) => {
    if(!req.user) return res.status(401).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/products");
})

//GET - Currente
router.get("/current",(req, res) => {
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ status: "error", message: "Ususario no logueado"});
    }
})

//Ruta para cerrar la sesión

router.get("/logout", (req, res ) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/");
})

//Ruta para ver el perfil:

router.get("/profile", (req, res) => {
    if(req.session.user) {
        res.render("profile", {user: req.session.user});
    } else {
        res.redirect("/login");
    }
})
// VERSION PARA GITHUB: 

// router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

// router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
//     //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session. 
//     req.session.user = req.user; 
//     req.session.login = true; 
//     res.redirect("/profile");
// })
// */



export default router;