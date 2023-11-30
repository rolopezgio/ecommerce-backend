const fs=require('fs')

class ProductManager {

    constructor(rutaDeArchivos) {

        this.path=rutaDeArchivos
        this.products = []
    }

    getPath() {
        return this.path;
    }

    addProducts(title, description, price, thumbnail, code, stock) {

        let productos = this.getProducts()

        let id = 1
        if (productos.length > 0) {
            id = productos[productos.length - 1].id + 1
        }

        let existe = productos.find(product => product.code === code)

        if (!title || !description || !price || !thumbnail || stock === undefined) {
            console.log('Faltan rellenar campos');
            return;
        }

        if (existe) {
            console.log(`El código ${code} ya existe.`)
            return
        }

        let nuevoProducto = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id
        }

        productos.push(nuevoProducto)

        fs.writeFileSync(this.path, JSON.stringify(productos, null, 5))
    }

    getProducts() {

        if (fs.existsSync(this.path)) {
        return JSON.parse(fs.readFileSync(this.path, "utf-8"))
        } else {
            return []
        }
    }

    getProductsById(id) {

        let productos = this.getProducts();

        let existeId = productos.find(product => product.id === id)

        if (existeId) {
            console.log(`Producto ${id} encontrado.`)
            return
        } else {
            console.log("Not found");
            return
        } 
    }

    updateProduct(id, objeto){
        let productos = this.getProducts()

        let indice= productos.findIndex(product=>product.id===id)

        if(!indice === -1){ 
           console.log(`El producto con id ${id} no existe`)           
           return

        }

        productos[indice]= {
            ...productos[indice],
            ...objeto,
            id
        }
        
        fs.writeFileSync(this.path, JSON.stringify(productos, null, 5))      
    }

    deleteProduct(id){
         let productos = this.getProducts()

         let indice= productos.findIndex(product=>product.id===id)

         if(indice === -1){ 
            console.log(`El producto con id ${id} no existe`)           
            return null; 

         }
         let productoEliminado = { ...productos[indice] };
         productos.splice(indice, 1);

         fs.writeFileSync(this.path, JSON.stringify(productos, null, 5));

         return productoEliminado;
        }
}

module.exports=ProductManager