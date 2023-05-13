const bcrypt = require('bcryptjs')
const Models = require('../models');
const validator = require('validator');

const User = Models.User

module.exports = {
  createUser: async function({ userInput }, req) {
    const errors = [];
    if(!validator.isEmail(userInput.email)) {
        errors.push({
          message: "EMAIL IS INVALID",
          error:  userInput.email
        })
    }
    if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
        errors.push({
          message: 'PASSWORD NEEDS ATLEAST 5 CHARACTERS'
        });
    }
    if (errors.length > 0) {
      const error = new Error('INVALID INPUT');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const email = args.userInput.email;
    const existingUser = await User.findOne({email: userInput.email});
    if (existingUser) {
        const error = new Error('USER EXISTS')
        throw error;
    }
    const hashedPwd = await bcrypt.hash(userInput.password, 12);
    const user = new User({
        email: userInput.email,
        name: userInput.name,
        password: hashedPwd
    })
    const createdUser = await user.save();
    return {...createdUser._doc, _id: createdUser._id.toString()}
  }
}