const products = require("../../models/Products");
const AdminUser = require("../../models/adminUser");

module.exports = {
  async findAdminUser(params) {
    return await AdminUser.findOne({
      userId: params,
    });
  },
  
  async getProducts() {
    return await products.find();
  },

  async getProduct(params) {
    return await products.find(params);
  },

  async updateProduct(params) {
    return await products.findOneAndUpdate(
      { _id: params._id },
      params.productData
    );
  },

  async deleteProduct(params) {
    return await products.deleteOne({ _id: params._id });
  },
  // db.movies.deleteOne( { cast: "Brad Pitt" } )
  async addProduct(params) {
    return await products.create(params);
  },
};
