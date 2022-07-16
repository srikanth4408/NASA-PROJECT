const mongoose = require('mongoose');
const planetSchema = new mongoose.Schema({
    keplerName:{
        type: String,
        required: true,
    }
});


//connects launches schema with "launches" collection
module.exports = mongoose.model('Planet', planetSchema);