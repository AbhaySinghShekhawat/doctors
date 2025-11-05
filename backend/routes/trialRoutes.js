let express = require('express');

let {
    getTrials,
    getTrial,
    createTrial,
    updateTrial,
    deleteTrial,}=require('../controllers/trialController');

    let {protect,authorize} = require('../utils/authUtils');

    let router = express.Router();

    // Public routes

    router.get('/',getTrials);
    router.get('/:id',getTrial);

    // Protected routes
router.post('/',protect,authorize('researcher'),createTrial);
router.put('/:id',protect,authorize('researcher'),updateTrial);
router.delete('/:id',protect,authorize('researcher'),deleteTrial);

module.exports = router;

