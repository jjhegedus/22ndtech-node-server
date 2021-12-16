var db = connect('127.0.0.1:27017/productsdb');

load('src/modules/mongoose-utilities/models/mongoose-utilities.js');

// load('src/modules/product/models/update-sequences-add-product-categories-seq.js');

// load('src/modules/product/models/modify-product-categories-add-DisplayIndices.js');

load('src/modules/product-attributes/models/update-sequences-add-product-attributes-seq.js');