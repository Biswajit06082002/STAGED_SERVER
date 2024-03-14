const mongoose = require('mongoose');
const { Schema } = mongoose;
const recordSchema = new mongoose.Schema({
userId: {
type: String,
required: true
},
videoId: {
type: String,
required: true
},
videoTitle:{
    type: String,

},

videoThumbnailLink:{
    type: String,

},

timeStamp: {
type: Date,
required: true
},

})
module.exports = mongoose.model('Record', recordSchema);