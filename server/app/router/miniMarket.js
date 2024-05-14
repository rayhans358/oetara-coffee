const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const miniMarketController = require('../controller/miniMarket');
const { checkAuthorization } = require('../middleware/authorization');

router.get('/',
  miniMarketController.getAllMiniMarkets
);

router.get('/:id',
  miniMarketController.getMiniMarketById
);

router.post('/',
  multer({dest: os.tmpdir()}).single('image'),
  checkAuthorization('create', 'MiniMarket'),
  miniMarketController.postNameMiniMarket
);

router.put('/:id',
  multer({dest: os.tmpdir()}).single('image'), 
  checkAuthorization('update', 'MiniMarket'),
  miniMarketController.putUpdateMiniMarket
);

router.delete('/:id',
  checkAuthorization('delete', 'MiniMarket'),
  miniMarketController.deleteMiniMarketById
);

module.exports = router;