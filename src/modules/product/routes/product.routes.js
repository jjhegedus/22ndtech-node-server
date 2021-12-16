'use strict';
const productController = require('../controllers/product.controller');
const productImagesController = require('../controllers/product-images.controller');
const productCategoriesController = require('../controllers/product-categories.controller');
const productProductCategoriesController = require('../controllers/product-product-categories.controller');
module.exports = function (app) {
    // Define application status route
    app.get('/products', productController.getProducts);
    app.get('/products/:id', productController.getProduct);
    app.post('/products', productController.addProducts);
    app.post('/products', productController.addProducts);
    app.del('/products', productController.deleteAllProducts);
    app.del('/products/:id', productController.deleteProduct);
    app.put('/products/:id', productController.updateProducts);
    app.get('/products/images/sign', productImagesController.sign);
    app.get('/products/images/authorizationheader', productImagesController.getAuthorizationHeader);
    app.get('/products/:productId/mainProductImage', productImagesController.getMainProductImage);
    app.del('/products/images/main', productImagesController.deleteMainProductImage);
    app.get('/products/:productId/images', productImagesController.getProductImages);
    app.del('/products/images/:imageId', productImagesController.deleteProductImage);
    app.put('/products/images/:imageId/move-up', productImagesController.moveUp);
    app.put('/products/images/:imageId/move-down', productImagesController.moveDown);
    app.put('/products/images/:imageId/move-to/:newDisplayIndex', productImagesController.moveTo);
    app.get('/product-categories', productCategoriesController.getProductCategories);
    app.post('/product-categories', productCategoriesController.addProductCategory);
    app.put('/product-categories/:productCategory', productCategoriesController.updateProductCategory);
    app.del('/product-categories/:productCategory', productCategoriesController.deleteProductCategory);
    app.put('/product-categories/:productCategory/move-to/:newDisplayIndex', productCategoriesController.moveTo);
    app.get('/product-categories/images/sign', productCategoriesController.getProductCategoryImageSignature);
    app.get('/product-product-categories/:productId', productProductCategoriesController.getProductProductCategories);
    app.get('/product-product-categories', productProductCategoriesController.getProductProductCategories);
    app.post('/product-product-categories/:productId/:productCategory', productProductCategoriesController.addProductProductCategory);
    app.del('/product-product-categories/:productId/:productCategory', productProductCategoriesController.deleteProductProductCategory);
};
//# sourceMappingURL=product.routes.js.map