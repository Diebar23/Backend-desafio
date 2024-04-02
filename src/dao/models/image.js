import mongoose, { mongo } from "mongoose";

const imageSchema = new mongoose.Schema({
    title: String,
    description: String, 
    filename: String,
    path: String
})

const ImageModel = mongoose.model("imagenes", imageSchema);

export default ImageModel;