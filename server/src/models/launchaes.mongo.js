const mongoose = require('mongoose');
const launchesSchema = new mongoose.Schema({
    flightNumber:{
        type: Number,
        required: true,
    },
    mission:{
        type: String,
        required: true,
    },
    rocket:{
        type: String,
        required: true,
    },
    lauchDate:{
        type: Date,
        required: true,
    },
    target:{
        type: String,
        //required: true,
    },
    customers:{
       type: [ String ],
       required: true,
    },
    upcoming:{
        type: Boolean,
        required: true,
    },
    success:{
        type: Boolean,
        required: true,
    }
});

//connects launches schema with "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);