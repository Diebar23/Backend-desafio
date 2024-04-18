const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

const CustomError = require("../services/errors/custom-error.js");
const { generarInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin.bind(userController));

const usersArray = [];
router.post("/", async (req, res, next) => { 
    const { nombre, apellido, email } = req.body;

    try {
        if (!nombre || !apellido || !email) {
            throw CustomError.crearError({
                nombre: "Usuario nuevo",
                causa: generarInfoError({ nombre, apellido, email }),
                mensaje: "Error al intentar crear un usuario",
                codigo: EErrors.TIPO_INVALIDO
            });
        }

        const user = {
            nombre,
            apellido,
            email
        }

        usersArray.push(user);
        console.log(usersArray);
        res.send({ status: "success", payload: user })

    } catch (error) {
        next(error);
    }
})


module.exports = router;