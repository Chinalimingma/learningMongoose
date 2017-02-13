'use strict'
 
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');

var users= User.find().lean(true)
               .sort({lastLogin:'descending'})
               .exec(function(err, users){
                    //console.log(users);
                    return users;
                });
var projects = Project.find()
                    .lean(true)
                    //.sort({projectName: 'descending'})
                    .exec(function(err, projects){
                        //console.log(projects);
                        return JSON.stringify(projects); 
                    }); 

module.exports = {
    show(req, res){        
     User.find({}) // will get all users
        .exec(function(err, users) {          

            var transformedUsers = users.map(function(user) {
                return user.toJSON();                
            });
            Project.find()
                .exec(function(err, projects){
                    var transformedProject = projects.map(function(project){
                        return project.toJSON();
                    });
                    // finish the request
                    res.render('index',{
                        users:transformedUsers,
                        projects: transformedProject, 
                        title: 'Mongoose'});
                });            
        });
    }
};   

    
                           
          
        