const mongoose = require('mongoose');
const wikiSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['technology', 'sustainability', 'equality'],
        required: true
    },
    description: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('wiki', wikiSchema);