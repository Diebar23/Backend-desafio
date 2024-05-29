//Testing de integración: analizará toda nuestra App en su conjunto. 
//Testing funcional: este evalua el comportamiento completo del sistema pero desde la vision del usuario. 

//Importamos supertest:
import supertest from "supertest"; 

//Importamos chai, recuerden que es un librería de aserciones para node js. 
import chai from "chai";

const expect = chai.expect;

//Vamos a crear la constante "requester", quien se encargará de realizar las peticiones al servidor. 

const requester = supertest("http://localhost:8080"); 

describe("Testing de la App Web Ecommerce", () => {
    //1) Productos: 

    describe("Testing de ecommerce: ", () => {
        it("Endpoint POST /api/products que debe crear un producto nuevo", async () => {

            //Voy a crear un mock para una mascota: 

            const productMock = {
                name: "medallon de pollo",
                description: "Puro pollo", 
                price: 800
            }

            const {statusCode, ok, _body} = await requester.post("/api/products").send(productMock);

            console.log(statusCode);
            console.log(ok);
            console.log(_body);

            //Podemos evaluar si el payload tiene una propiedad id, si lo tiene se pudo crear correctamente el documento del producto. 
            expect(_body.payload).to.have.property("_id"); 

        })

          //1) Verificamos que el comprado sea false: 

          it("Validamos que comprado sea false, al crear un producto", async () => {

            const newProduct = {
                name: "milanesa de soja", 
                description: "muy natural", 
                price: 600
            }

            const { statusCode, _body} = await requester.post("/api/products").send(newProduct);

            expect(statusCode).to.eql(200);
            expect(_body.payload).to.have.property("comprado").that.eql(false);
            //Verificamos que se crea correctamente el producto y que la propiedad "comprado" esta en false    
        })

    
        // Si se crea producto sin el campo nombre, se debe retornar status 400:

        it("Si se crea producto sin el campo nombre, se debe retornar status 400", async () => {
            const productWithoutName = {
                descrption: "puro pollo",
                price: 600
            }

            const { statusCode } = await requester.post("/api/products").send(productWithoutName);

            expect(statusCode).to.eql(400);

        })

        // Al obtener a los productis con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo.

        it("Al obtener a los productos con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo.", async () => {

            const {statusCode, _body} = await requester.get("/api/products");

            //Evaluamos: 

            expect(statusCode).to.eql(200);
            expect(_body.payload).that.is.an("array");

        })
    })

    //Test avanzados: 
    describe("Test Avanzado", () => {
        //Me voy a crear una variable global para el test para almacenar el valor de la cookie: 
        let cookie; 

        //1) Registro de usuarios:  
        it("Debe registrar correctamente a un usuario", async () => {
            const mockUser = {
                first_name: "Pepe", 
                last_name: "Argento",
                email: "PA@ecommerce.com", 
                password: "1234"
            }

            const {_body} = await requester.post("/api/user").send(mockUser);

            //Validamos que tenemos payload: 
            expect(_body.payload).to.be.ok;
        })
        // Login del usuario
        it("Se debe loguear el usuario y recuperar la cookie", async () => {

            //enviamos el login con los datos creados en el paso anterior: 
            const mockLogin = {
                email: "PA@ecommerce.com",
                password: "1234"
            }

            const result = await requester.post("/api/login").send(mockLogin);

            //Se obtiene la cookie de la sesion y se guarda en una variable: 
            const cookieResult = result.headers['set-cookie']['0'];

            //Verificamos que la cookie recuperada exista
            expect(cookieResult).to.be.ok;

            //Separo clave y valor y me lo guardo en mi variable global: 

            cookie = {
                name: cookieResult.split("=")['0'],
                value: cookieResult.split("=")['1']
            }

            //Chequeamos que el nombre de la cookie que recuperamos sea igual a la de mi app: 
            expect(cookie.name).to.be.ok.and.eql("coderCookie");
            expect(cookie.value).to.be.ok;

        })
        //3) Probamos la ruta current:
        it("Debe enviar la cookie que contiene el usuario", async () => {
            
            //Enviamos la cookie que nos guardamos previamente: 
            
            const {_body} = await requester.get("/api/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);

            //Verificamos que tenga el mail de mi usuario: 

            expect(_body.payload.email).to.be.eql("PA@ecommerce.com");

        })
    })

})