const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profilePhoto: { type: String, default: '/uploads/default-profile.png' },
    country: { type: String, default: 'Brasil' },
    birthdate: { type: String, default: '01/01/2000' },
    phone: { type: String, default: '(11) 99999-9999' }
});

module.exports = mongoose.model('User', UserSchema);
//sousa