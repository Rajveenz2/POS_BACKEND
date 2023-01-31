const productService = require("../../services/product/productService");

module.exports = {
  getProducts: async function (req, res) {
    try {
      let products = await productService.getProducts(req.body);
      res.status(200).send({ products, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  getProduct: async function (req, res) {
    try {
      let product = await productService.getProduct(req.body);
      res.status(200).send({ product, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  updateProduct: async function (req, res) {
    try {
      let updateProduct = await productService.updateProduct(req.body);
      res.status(200).send({ updateProduct, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  deleteProduct: async function (req, res) {
    try {
      let deleteProduct = await productService.deleteProduct(req.body);
      res.status(200).send({ deleteProduct, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  addProduct: async function (req, res) {
    try {
      let addProducts = await productService.addProduct(req.body);
      res.status(200).send({ addProducts, message: "Success" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },

  addCostConfig: async function (req, res) {
    try {
      await productService.addCostConfig(req.body);
      res.status(200).send({ message: "Success" });
    } catch (error) {
      res.status(400).send({ error: true, message: error.message });
    }
  },
};
