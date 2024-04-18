class CustomError {
    static createError({nombre = "Error", causa = "desconcido", mensaje, codigo = 1}) {
        const error = new Error(mensaje);
        error.name = nombre;
        error.cause = causa;
        error.code = codigo;
        throw error;
        //Lanzamos el error, esto detiene la ejecución de la app, por eso debemos capturarlo en otro módulo. 
    }
}

module.exports = CustomError;