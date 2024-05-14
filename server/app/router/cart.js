const router = require('express').Router();
const cartController = require('../controller/cart');
const { checkAuthorization } = require('../middleware/authorization');

router.get(
  '/',
  checkAuthorizationn('read', 'Cart'),
  cartController.getCart
);

router.put(
  '/',
  checkAuthorization('update', 'Cart'),
  cartController.putUpdateCart
);

module.exports = router;