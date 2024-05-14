const router = require('express').Router();
const tagController = require('../controller/tag');
const { checkAuthorization } = require('../middleware/authorization');

router.get('/',
  tagController.getAllTags
);

router.get('/:id',
  tagController.getTagById
);

router.post('/', 
  checkAuthorizationn('create', 'Tag'),
  tagController.postTag
);

router.put('/:id', 
  checkAuthorization('update', 'Tag'),
  tagController.putUpdateTag
);

router.delete('/:id', 
  checkAuthorization('delete', 'Tag'),
  tagController.deleteTagByid
);

module.exports = router;