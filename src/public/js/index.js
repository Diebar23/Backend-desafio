const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
}); 

//Función para renderizar la tabla de productos:
const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";


    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        //Agregamos boton para eliminar: 
        card.innerHTML = `
                <p>Id: ${item.id} </p>
                <p>Titulo: ${item.title} </p>
                <p>Precio: ${item.price} </p>
                <button> Eliminar Producto </button>
        
        `;
        productsContainer.appendChild(card);

        //Agregamos el evento eliminar producto:
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        });
    });
}

//Eliminar producto: 
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

//Agregar producto:

document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
});


const addProduct = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").value === "true",
        category: document.getElementById("category").value,
        thumbnail: document.getElementById("thumbnail").value 
    };
    
    socket.emit("addProduct", producto);
};