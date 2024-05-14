const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const ewalletController = require('../controller/ewallet');
const { checkAuthorization } = require('../middleware/authorization');

router.get('/',
  ewalletController.getAllEwallets
);

router.get('/:id',
  ewalletController.getEwalletById
);

router.post('/',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'MiniMarket'),
  ewalletController.postNameEwallet
);

router.put('/:id',
  multer({dest: os.tmpdir()}).single('image'), 
  checkAuthorization('update', 'MiniMarket'),
  ewalletController.putUpdateEwallet
);

router.delete('/:id',
  checkAuthorization('delete', 'MiniMarket'),
  ewalletController.deleteEwalletById
);

module.exports = router;