const express = require('express');
const router = express.Router();
const { getAllClubs, getClubById, createClub, updateClub, deleteClub } = require('../controllers/clubController');

router.get('/', getAllClubs);
router.get('/:id', getClubById);
router.post('/', createClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

module.exports = router;
