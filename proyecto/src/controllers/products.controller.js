const { productsModelo } = require('../dao/models/products.model');

class ProductController {
  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, query = '', sort, category, availability } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);

      const skip = (page - 1) * limit;

      let productos = [];

      const sortOptions = {};
      if (sort) {
        const order = sort.startsWith('-') ? -1 : 1;
        const field = sort.replace(/^-/, '');
        sortOptions[field] = order;
      }

      const searchOptions = {};
      if (query) {
        searchOptions.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { price: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ];
      }

      if (category) {
        searchOptions.category = category;
      }

      if (availability !== undefined) {
        searchOptions.stock = availability === 'true' ? { $gt: 0 } : 0;
      }

      productos = await productsModelo
        .find(searchOptions)
        .limit(limit)
        .skip(skip)
        .sort(sortOptions);

      const totalProductos = await productsModelo.countDocuments(searchOptions);
      const totalPages = Math.ceil(totalProductos / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
      const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

      res.status(200).json({
        status: 'success',
        payload: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ status: 'error', error: 'Error al obtener productos.' });
    }
  }

  async getProductById(req, res) {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `Ingrese un id válido...!!!` });
    }

    let existe;
    try {
      existe = await productsModelo.findById(id);
      console.log(existe);
    } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, detalle: error.message });
    }

    if (!existe) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `No existen productos con id ${id}` });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ producto: existe });
  }

  async createProduct(req, res) {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso denegado: Solo los administradores pueden crear productos' });
      }
      const { title, description, price, thumbnail, code, stock, category } = req.body;

      if (!title || !description || !price || !category || stock === undefined) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Faltan completar campos' });
      }

      let existe = await productsModelo.findOne({ code });
      if (existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El código ${code} ya existe en BD` });
      }

      const nuevoProducto = new productsModelo({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
      });
      await nuevoProducto.save();
      res.json(nuevoProducto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Ingrese un ID de producto válido' });
      }
  
      const product = await productsModelo.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'No se encontró el producto' });
      }
  
      if (req.user.isAdmin) {
        await productsModelo.updateOne({ _id: id }, req.body);
        return res.status(200).json({ message: 'Producto actualizado correctamente' });
      } else {
        return res.status(403).json({ error: 'Acceso denegado: Solo los administradores pueden modificar productos' });
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Ingrese un ID de producto válido' });
      }

      const product = await productsModelo.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'No se encontró el producto' });
      }

      const owner = await UserModel.findOne({ email: product.owner });
      if (owner && owner.role === 'premium') {
        await mailer.sendEmail({
          to: owner.email,
          subject: 'Producto eliminado',
          text: `Hola ${owner.nombre},\n\nTu producto ${product.title} ha sido eliminado. Para más detalles, ponte en contacto con el soporte.`,
        });
      }

      await productsModelo.deleteOne({ _id: id });
      return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }
}


module.exports = new ProductController();