const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');


router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.allSauces);
router.get('/:id', auth, sauceCtrl.oneSauce);

module.exports = router;