const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/facebookauth",
    {useNewUrlParser: true,
    useUnifiedTopology: true
    });
var userSchema = mongoose.Schema({
    uid: String,
    email: String,
    name: String,
    pic: String
});

module.exports = mongoose.model('User',userSchema);
