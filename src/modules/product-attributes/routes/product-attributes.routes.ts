'use strict';

const productAttributesController = require('../controllers/product-attributes.controller');
const productAttributeValuesController = require('../controllers/product-attribute-values.controller');

module.exports = function (app) {
    app.get('/product-attributes', productAttributesController.getProductAttributes);
    app.post('/product-attributes', productAttributesController.addProductAttribute);
    app.del('/product-attributes/:productAttribute', productAttributesController.deleteProductAttribute);
    app.put('/product-attributes/:productAttribute/setDisplayIndex/:newDisplayIndex', productAttributesController.setDisplayIndex);
    
    app.get('/product-attributes-values/:productAttributeId', productAttributeValuesController.getProductAttributeValues);
    app.get('/product-attributes-values', productAttributeValuesController.getProductAttributeValues);
    app.post('/product-attributes-values/:productAttributeId/:productAttributeValue', productAttributeValuesController.addProductAttributeValue);
    app.del('/product-attributes-values/:productAttributeValueId', productAttributeValuesController.deleteProductAttributeValue);
    app.put('/product-attributes-values/:productAttributeValueId/setDisplayIndex/:newDisplayIndex', productAttributeValuesController.setDisplayIndex);
};