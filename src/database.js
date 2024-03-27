
import mongoose from "mongoose";
import configObject from "./config/config.js";
const {mongo_url} = configObject;

// mongoose.connect(mongo_url)
//     .then(() => console.log("Conexión exitosa"))
//     .catch(() => console.log("Error de conexión", error))
    class DataBase {
        static #instance; 
    
        constructor(){
            mongoose.connect(mongo_url);
        }
    
        static getInstance() {
            if(this.#instance) {
                console.log("Conexion previa");
                return this.#instance;
            }
    
            this.#instance = new DataBase();
            console.log("Conexión exitosa!!");
            return this.#instance;
        }
    }
    
    export default DataBase.getInstance();  