const router = require('express').Router();
const deliveryAddressController = require('../controller/deliveryAddress');
const { checkAuthorization } = require('../middleware/authorization');

router.get('/',
  checkAuthorization('view', 'DeliveryAddress'),
  deliveryAddressController.getDeliveryAddress
);

router.get('/:id',
  checkAuthorization('view', 'DeliveryAddress'),
  deliveryAddressController.getDeliveryAddressById
);

router.post('/',
  checkAuthorization('create', 'DeliveryAddress'),
  deliveryAddressController.postDeliveryAddress
);

router.put('/:id',
  checkAuthorization('update', 'DeliveryAddress'),
  deliveryAddressController.putUpdateDeliveryAddress
);

router.delete('/:id',
  checkAuthorization('delete', 'DeliveryAddress'),
  deliveryAddressController.deleteDeliveryAddressById
);

module.exports = router;