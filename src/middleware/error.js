const { EErrors } = require("../services/errors/enums.js");

const errorManager = (error, req, res, next) => {
    console.log(error.causa);
    console.log("Testing");
    switch (error.code) {
        case EErrors.TIPO_INVALIDO:
            res.send({ status: "error", error: error.nombre })
            break;
        default:
            res.send({ status: "error", error: "Error desconocido" })
    }
}

module.exports = errorManager;