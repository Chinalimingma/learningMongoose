'use strict';

var mongoose = require( 'mongoose' );
var Project = mongoose.model( 'Project' );

module.exports = {
//-get /project/new
    create(req, res){
        res.render('project-form', {
            title: 'Create project',
            buttonText: 'Create'
        });
    }, 

//-post /project/new
    doCreate(req, res){
        Project.create({
            projectName:req.body.projectName,
            createdBy: req.body.userid,
            createdOn: Date.now()
        }, function(err, project){

        });
    },

//-get  /project/:id
    displayInfo(req, res){
        console.log("Finding project _id: " + req.params.id);
        if (!req.session.loggedIn){
            res.redirect('/login');
        }else {
            if (req.params.id) {
                Project.findById(req.params.id)
                //.populate('contributors','name email')
                .populate('createdBy', 'name email')                
                .exec (function(err,project) {
                    if(err){
                        console.log(err);
                        res.redirect('/user?404=project');
                    }else{
                        console.log(project);
                        res.render('project-page', {
                                title: project.projectName,
                                projectName: project.projectName,
                                tasks: project.tasks,
                                createdBy: project.createdBy,
                                projectID: req.params.id
                            });
                    }                    
                });
            }else{
                res.redirect('/user');
            }
        }
    },
/* ***** P110
  we wanted to populate a maximum of five contributors who have an e-mail
address at theholmesoffice.com, to sort them by name and return name and
lastLogin information

 .populate({
    path: 'contributors',                       //path: This is the path to populate and is required.
    match: { email: /@theholmesoffice\.com/i }, //This can specify query conditions.
    select: 'name lastLogin',                   //This is a string or object specifying which paths to return.
    options: { limit: 5, sort: 'name' },        //This can specify query options. populate a maximum of five contributors
    model:                                      //This is the name of the model you want to populate from. It defaults
    })
 ****** */
//***Update */
//-get  /project/edit/:id
// Edit selected project form
    edit(req, res){},

//-post  /project/edit/:id
// Edit selected project action
    doEdit(req, res){
        Project.findById(req.params.projectID, "tasks modifiedOn",
        function(err, project){
            if(!err){
                project.tasks.push({
                    taskName: req.body.taskName,
                    taskDesc: req.body.taskDesc,
                    createdBy: req.session.user._id
                });
                project.modifiedOn = Date.now();
                project.save(function(err, project){
                    if(err){
                        console.log('Oh dear', err);
                    }else{
                        console.log('Task saved: ' + req.body.taskName );
                        res.redirect('/project/' + req.body.projectID);
                    }
                });
            }
        });
    },

//-get  /project/delete/:id
//Delete selected project form
    confirmDelete(req, res){},

//-post  /project/delete/:id
// Delete selected project action
    doDelete(req, res){},

//-get  /project/byuser/: userid
    byUser(req, res){
        console.log("Getting user projects");
        if(req.params.userid){
            Project.findByUserID(
                req.params.userid,
                function(err, projects){
                    if(!err){
                        console.log(projects);
                        res.json(projects);
                        }else{
                            console.log(err);
                            res.json({
                                "status": "error"
                                ,"error": "Error finding projects"
                            });
                        }
                });
            }else{
                console.log("No user id supplied");
                res.json({"status" : "error"
                          ,"error" : "No user id supplied"});
            }
    },

//-get  /project/:id/task/new
    createTask(req, res){},

//-post /project/:id/task/new
    doCreateTask(req, res){},

//-get  /project/:id/task/edit/:taskid
    editTask(req, res){},

//-post  /project/:id/task/edit/:taskid
    doEditTask(req, res){
        Project.findById(req.body.projectID, 'tasks modifiedOn',
            function(err, project){
                if(!err){
                    console.log(project.tasks) //array of tasks
                    var thisTask = project.tasks.id(req.params.taskID);
                    console.log(thisTask); //individual task document
                }
            });
    },

//-get  /project/:id/task/delete/:taskid
    confirmDeleteTask(req, res){

    },

//-post  /project/:id/task/delete/:taskid
    doDeleteTask(req, res){
        Project.findById(req.body.projectID, 'tasks modifiedOn',
            function(err, project){
                if(!err){
                    console.log(project.tasks) //array of tasks
                    var thisTask = project.tasks.id(req.params.taskID);
                    console.log(thisTask); //individual task document
                    thisTask.remove(function(err){
                      /*
                        As with all changes to subdocuments, a removed subdocument won't 
                        actually be deleted until the parent document is saved.
                      */  
                    });
                }
            });    
    }

}