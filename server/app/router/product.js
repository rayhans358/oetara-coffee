const router = require("express").Router();
const multer = require('multer');
const os = require('os');
const productController = require('../controller/product');
const { checkAuthorization } = require("../middleware/authorization");

router.get('/',
  checkAuthorization('read', 'Product'),
  productController.getAllProducts
);

router.get('/:id',
  checkAuthorization('read', 'Product'),
  productController.getProductById
);

router.post('/',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'Product'),
  productController.postProduct
);

router.put('/:id',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('update', 'Product'),
  productController.putUpdateProduct
);

router.delete('/:id',
  checkAuthorization('delete', 'Product'),
  productController.deleteProductById
);

module.exports = router;