class ProductManager {

    constructor() {
        this.products = []
    }

    getProducts() {
        return this.products
    }

    addProducts(title, description, price, thumbnail, code, stock) {

        let id = 1
        if (this.products.length > 0) {
            id = this.products[this.products.length - 1].id + 1
        }

        let existe = this.products.find(product => product.code === code)

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

        this.products.push(nuevoProducto)
    }

    getProductsById(id) {

        let existeId = this.products.find(product => product.id === id)

        if (existeId) {
            console.log(`Producto ${id} encontrado.`)
            return
        } else {
            console.log("Not found")
        }
    }
}

const productManager = new ProductManager()

productManager.addProducts('Remera', 'Tela de algodon', 2000, 'Ruta de la imagen', 123, 10)
productManager.addProducts('Buzo', 'Tela de hilo', 1000, 'Ruta', 123, 20)
productManager.addProducts('Pantalon', 'Tela de nylon', 1000, 'Ruta', 124, 20)

console.log(productManager.getProducts())

productManager.getProductsById(2)
productManager.getProductsById(4)