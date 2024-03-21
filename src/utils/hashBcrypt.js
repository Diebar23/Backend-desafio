//Bcrypt es una librería de hashing de contraseñas. 

//npm install bcrypt

import bcrypt from "bcrypt";
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));


export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

//Comparar los password.

// module.exports = {
//     createHash,
//     isValidPassword
// }