const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'NEWBIE'
    },
    Posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
},
{
    timestamps: true,
    collection: 'Users'
});

module.exports = mongoose.model('User', userSchema)