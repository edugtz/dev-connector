const { validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      }).populate('user', ['name', 'avatar']);

      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
      }

      return res.json(profile);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  createProfile: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubUser,
      skills,
      youtube,
      facebook,
      twitter,
      linkedin,
      instagram,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubUser) profileFields.githubUser = githubUser;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();

      return res.status(201).json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server error');
    }
  },
  getProfiles: async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', [
        'name',
        'avatar',
      ]);

      if (!profiles) {
        return res.status(400).json({ msg: 'There are no profiles' });
      }

      return res.status(200).json(profiles);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  getProfileByUser: async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id,
      }).populate('user', ['name', 'avatar']);

      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }

      return res.json(profile);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Profile not found' });
      }
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  deleteProfile: async (req, res) => {
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });

      return res.json({ msg: 'User deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  updateProfileExperience: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();

      return res.json({ profile });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  deleteExperience: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const experiences = profile.experience.filter(
        (experience) => experience.id !== req.params.exp_id
      );

      profile.experience = experiences;
      await profile.save();

      return res.json({ msg: 'Experience deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  updateProfileEducation: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();

      return res.json({ profile });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  deleteEducation: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const educations = profile.education.filter(
        (education) => education.id !== req.params.education_id
      );

      profile.education = educations;
      await profile.save();

      return res.json({ msg: 'Education deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
};
