const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
email: {
type: String,
unique: true,
required: true
},
password: {
type: String,

},
username: {
type: String,
unique: true,
},
creation_date: {
type: String
},
signin_type: {
    type: String,
    required: true
}
})
module.exports = mongoose.model('User', userSchema);