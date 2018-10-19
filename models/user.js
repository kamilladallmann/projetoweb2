
    var mongoose = require('mongoose');
    var bcrypt = require('bcryptjs');
    var UserSchema = new mongoose.Schema({

        name:{
            type: String,
            require: true,
        },
        email:{
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: true,
            select: false,
        },
    });


    User = mongoose.model('User', UserSchema);

    module.exports = User;
