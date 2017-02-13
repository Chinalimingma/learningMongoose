'use strict';
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

var clearSession = function(session, callback){
    session.destroy();
    callback();
};

//CRUD
module.exports = {
//-get   /user
    index(req, res){
       if(req.session.loggedIn){
            res.render('user-page', {
                title: req.session.user.name,
                name: req.session.user.name,
                email: req.session.user.email,
                userID: req.session.user._id
            })
            }else{
                res.redirect('/login');
            } 
    },
// Creating user data
//-get  /user/new
    create(req, res){
        res.render('user-form', {
            title: 'Create user',
            name: "",
            email: "",
            buttonText: 'Create'
        });
    }, 

    //ModelName.create(dataObject,callback)
//-post  /user/new
    doCreate(req, res){
        User.create({
        name: req.body.FullName,
        email: req.body.Email,
        modifiedOn : Date.now(),
        lastLogin : Date.now()
        }, function( err, user ){
            if(err){
                console.log(err);
                //MongoDB error codes 
                if(err.code===11000){
                    res.redirect( '/user/new?exists=true' );
                    }else{
                        res.redirect('/?error=true');
                    }
                }else{
                    // Success
                    console.log("User created and saved: " + user);
                    req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
                    req.session.loggedIn = true;
                    res.redirect( '/user' );
                    }
                });
            },

//-get /user/edit
        edit(req, res){
            if(!req.session.loggedIn){
                res.redirect('/login');
            }else{
                res.render('user-form', {
                    title: 'Edit profile',
                    _id: req.session.user._id,
                    name: req.session.user.name,
                    email: req.session.user.email,
                    buttonText: "Save"
                    });
            }
        },

//-post /user/doEdit
        doEdit(req, res){
           if (req.session.user._id) {
                User.findById( req.session.user._id,
                //separate function:  doEditSave(req, res, err, user)
                function (err, user) {
                    if(err){
                        console.log(err);
                        res.redirect( '/user?error=finding');
                    }else{
                        user.name = req.body.FullName;
                        user.email = req.body.Email;
                        user.modifiedOn = Date.now();

                        //separate function:  onEditSave(req, res, err, user)
                        user.save(function(err){
                            if(!err){
                                console.log('User updated: ' + req.body.FullName);
                                req.session.user.name = req.body.FullName;
                                req.session.user.email = req.body.Email;
                                res.redirect( '/user' );
                            }else{
                               console.log(err);
                               res.redirect( '/user?error=saving'); 
                            }
                        });         
                    }
                });
           }          
        },

//-get /user/delete
// GET user delete confirmation form
        confirmDelete(req, res){
            res.render('user-delete-form', {
                title: 'Delete account',
                _id: req.session.user._id,
                name: req.session.user.name,
                email: req.session.user.email
                });
        },

//-post /user/delete
// POST user delete form
        doDelete(req, res){
            if (req.body._id) {
                User.findByIdAndRemove(
                    req.body._id,
                    function (err, user) {
                        if(err){
                            console.log(err);
                            return res.redirect('/user?error=deleting');
                        }
                        console.log("User deleted:", user);
                        clearSession(req.session, function () {
                        res.redirect('/');
                        });
                    }
                );
            }
        },

//-get /logout
        doLogout(req, res){},

        // Login form
//-get /login
        login(req, res){
            res.render('login-form', {title: "Log in"})
        },                      

        // Login action
//-post /login
        doLogin(req, res){
          if (req.body.Email) {
            User.findOne(
                {'email' : req.body.Email}, //conditions-- The data object to query the database
                '_id name email',           //fields --The data keys we want to be returned
                function(err, user) {       //The callback function for when the database has finished looking
                    if (!err) {
                        if (!user){
                            res.redirect('/login?404=user');
                        }else{
                            req.session.user = {
                            "name" : user.name,
                            "email": user.email,
                            "_id": user._id
                            };
                            req.session.loggedIn = true;
                            console.log('Logged in user: ' + user);
                            /*
                                var _id = person._id; //需要取出主键_id
                                delete person._id;    //再将其删除
                            */
                            User.update(
                                {_id: user._id},
                                {$set: {lastLogin: Date.now()}},
                                function(){
                                res.redirect( '/user' );
                                }
                            );                            
                        }
                      } else {
                                res.redirect('/login?404=error');
                            }
                        });
          }else{
            res.redirect('/login?404=error');
          }
    }
}
