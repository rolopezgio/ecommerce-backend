const fs=require('fs')

class ProductManager {

    constructor(rutaDeArchivos) {

        this.path=rutaDeArchivos
        this.products = []
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

        //validacion 

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

         if(!indice === -1){ 
            console.log(`El producto con id ${id} no existe`)           
            return

         }

         productos.splice(indice, 1)

         fs.writeFileSync(this.path, JSON.stringify(productos, null, 5))
    }
}

const productManager = new ProductManager('./archivos/productos.json')

productManager.addProducts('Remera', 'Tela de algodon', 2000, 'Ruta de la imagen', 123, 10)
productManager.addProducts('Buzo', 'Tela de hilo', 1000, 'Ruta', 123, 20)
productManager.addProducts('Pantalon', 'Tela de nylon', 1000, 'Ruta', 124, 20)
productManager.addProducts('Short', 'Tela de nylon', 1000, 'Ruta', 125, 20)
productManager.addProducts('Medias', 'Tela de algodon', 1000, 'Ruta', 126, 20)

console.log(productManager.getProducts())

productManager.deleteProduct(3)

productManager.updateProduct(1, {title:"Remeron"})
console.log(productManager.getProducts())

productManager.getProductsById(1)
productManager.getProductsById(8)