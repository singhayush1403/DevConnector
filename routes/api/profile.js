const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const {
    check,
    validationResult
} = require('express-validator/check')
const auth = require('../../middleware/auth')
//@route GET api/profile/me
//desc   GET current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({
                msg: "No Profile for this user"
            });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error");
    }
});
//@route POST api/profile
//desc   POST create or Update profile
//@access Private

router.post('/', [auth, [check('status', 'Status is required').not().isEmpty(), check('skills', "Skills is required").not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile Project
    const profileFields = {

    };
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    console.log(skills);
    console.log(profileFields.skills);
    //  build social Object
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (youtube) profileFields.social.youtube = youtube;
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (profile) {
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });
            return res.json(profile);
        }
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})
//@route get api/profile
//desc   get all
//@access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({
                msg: "No profile found"
            });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({
                msg: "No profile found"
            });
        }
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router;