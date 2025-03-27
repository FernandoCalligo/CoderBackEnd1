import Product from "../models/Product.js";

export class ProductManager {
    constructor() {}


    // Funcion para obtener todos los productos
    async getProducts({ limit = 10, page = 1, sort, query }) {
        try {
            const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
                lean: true // Para devolver objetos JS en lugar de instancias de Mongoose
            };

            const result = await Product.paginate(filter, options);

            return {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
            };
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return { status: "error", message: "Error al obtener los productos" };
        }
    }
    // Funcion para obtener un producto mediante el ID
    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            return null;
        }
    }

    // Funcion para agregar un producto
    async addProduct(productData) {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            return null;
        }
    }

    // Funcion para actualizar un producto mediante el ID
    async updateProduct(id, updatedFields) {
        try {
            return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            return null;
        }
    }

    // Funcion para eliminar un producto mediante el ID
    async deleteProduct(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return null;
        }
    }
}
