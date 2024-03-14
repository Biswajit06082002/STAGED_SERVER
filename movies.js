const mongoose = require('mongoose');
const { Schema } = mongoose;
const movieLinkSchema = new mongoose.Schema({
videoId: {
type: String,
unique: true,
required: true
},
videoIframe: {
type: String,
required: true
},
isAvailable:{
    type: Boolean,

}

})
module.exports = mongoose.model('Movies', movieLinkSchema);