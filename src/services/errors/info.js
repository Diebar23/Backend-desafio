const generateInfoError = (user) => {
    return ` Los datos estan incompletos o no son válidos. 
    Debe enviar los siguientes datos: 
    - Nombre: String, recibimos ${user.nombre}
    - Apellido: String, recibimos ${user.apellido}
    - Email: String, recibimos ${user.email}
    `
}

module.exports = {
    generateInfoError
}