const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middlewares/auth');
const {
  getProfile,
  createProfile,
  getProfiles,
  getProfileByUser,
  deleteProfile,
  updateProfileExperience,
  deleteExperience,
  updateProfileEducation,
  deleteEducation,
} = require('../../controllers/profileController');

router.get('/me', auth, getProfile);
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').notEmpty(),
      check('skills', 'Skills is required').notEmpty(),
    ],
  ],
  createProfile
);
router.get('/', getProfiles);
router.get('/user/:user_id', getProfileByUser);
router.delete('/', auth, deleteProfile);
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('from', 'From date is required').notEmpty(),
    ],
  ],
  updateProfileExperience
);
router.delete('/experience/:exp_id', auth, deleteExperience);
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').notEmpty(),
      check('degree', 'Degree is required').notEmpty(),
      check('fieldOfStudy', 'Field of study is required').notEmpty(),
      check('from', 'From date is required').notEmpty(),
    ],
  ],
  updateProfileEducation
);
router.delete('/education/:education_id', auth, deleteEducation);

module.exports = router;
