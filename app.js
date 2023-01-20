const express = require('express');

const app = express();

const passport = require('passport');

const User = require('./models/User')

const session = require('express-session');

const facebookStrategy = require('passport-facebook').Strategy;

app.set("view engine", "ejs");
app.use(session({secret: "express-session"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: "thesecrectkey" }));

passport.use(new facebookStrategy({
    clientID: "1528847367596850",
    clientSecret: "f58bf33a35bd16088d5fc69047bf7885",
    callbackURL: "http://localhost:5000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'email']
},
    function (token, refreshToken, profile, done) {
        process.nextTick(function(){
            User.findOne({'uid': profile.id}, function(err,user){
                if(err){
                    return done(err);
                }
                if(user){
                    console.log("user found");
                    console.log(user)
                    return done(null,user);
                }else{
                    var newUser = new User();

                    newUser.uid = profile.id;
                    newUser.token = token;
                    newUser.name = profile.name.givenName + ' '+profile.name.familyName;
                    newUser.email = profile.emails[0].value;
                    newUser.pic = profile.photos[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null,newUser);
                    });
                }
            });
        });
    }
));



passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id,function(err,user){
        done(err,user);
    })

    return done(null, id)
});

app.get('/profile', (req, res) => {
    res.send("You are a valid user!")

});

app.get('/failed', (req, res) => {
    res.send("You are not a valid user!!!")
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed'
}));

app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.listen(5000, () => console.log("listenting on port 5000"));