
//Importamos los módulos:

import passport from "passport";
import local from "passport-local";

//Traemos el UserModel y las funciones de bcrypt

import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

//Passport con GitHub:

// const GitHubStrategy = require("passport-github2");

const LocalStrategy = local.Strategy;

export const initializePassport = () => {

    passport.use("register", new LocalStrategy({
        //Acceder al objeto request

        passReqToCallback: true, 
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body; 
        try {
            //Verificamos si ya existe un registro con ese mail

            let user = await UserModel.findOne({ email });
            if( user ) return done(null, false);
            //Si no existe, creo un registro de usuario nuevo

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            //Si ok, mandar done con el usuario generado. 

            return done(null, result);        
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos para el "login":

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Primero verifico si existe un usuario con ese mail.

            const user = await UserModel.findOne({ email });
            if(!user) {
                console.log("Usuario inexistente");
                return done(null, false);
            }
            //Si existe verifico la contraseña: 
            
            if(!isValidPassword(password, user)) {
                return done(null, false);
            }
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        let user = await UserModel.findById({_id: id});
        done(null, user);
    })

    //Estrategia con GitHub: 
    // passport.use("github", new GitHubStrategy({
    //     clientID: "Iv1.7cddb704597563d0",
    //     clientSecret: "45a1274c1d95f16706863ce2305836ad6369e3a3",
    //     callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    // }, async (accessToken, refreshToken, profile, done) => {
    //     console.log("Profile: ", profile);
    //     try {
    //         let user = await UserModel.findOne({ email: profile._json.email })

    //         if (!user) {
    //             let newUser = {
    //                 first_name: profile._json.name,
    //                 last_name: "",
    //                 age: 48,
    //                 email: profile._json.email,
    //                 password: ""
    //             }
    //             let result = await UserModel.create(newUser);
    //             done(null, result)
    //         } else {
    //             done(null, user);
    //         }

    //     } catch (error) {
    //         return done(error);
    //     }

    // }))

}


// module.exports = initializePassport;