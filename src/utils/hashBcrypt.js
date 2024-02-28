//Bcrypt es una librería de hashing de contraseñas. 

//npm install bcrypt

const bcrypt = require("bcrypt");
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//genSaltSync(10): generará un salt de 10 caracteres. 

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

//Comparar los password.

module.exports = {
    createHash,
    isValidPassword
}