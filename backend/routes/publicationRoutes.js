let express = require('express');
let{
    createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} = require('../controllers/publicationController');
let {protect} = require('../utils/authUtils');

let router = express.Router();

// public route
router.get("/",getPublications);
router.get("/:id" ,getPublicationById);

//  PROTECTED ROUTES (only logged-in researchers)
router.post("/",protect,createPublication);
router.put("/:id",protect,updatePublication);
router.delete("/:id",protect,deletePublication);

module.exports = router;
