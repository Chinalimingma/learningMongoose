
var express = require('express');
var user = require("./user");
var project = require("./project");
var index = require('./indexController');
var router = express.Router();


router.use(function(req, res, next){
   //res.locals.currentUser = req.user;
   //res.locals.errors = req.flash('errors');
   //res.locals.infos = req.flash('info');
   next();
});


// GET home page 
router.get('/', index.show);
 
 //USER ROUTERS 
router.get('/user', user.index);                      // Current user profile
router.get('/user/new', user.create);                 // Create new user form
router.post('/user/new', user.doCreate);              // Create new user action
router.get('/user/edit', user.edit);                  // Edit current user form
router.post('/user/edit', user.doEdit);               // Edit current user action
router.get('/user/delete', user.confirmDelete);       // delete current user form
router.post('/user/delete', user.doDelete);           // Delete current user action
router.get('/logout', user.doLogout);                 // Logout current user
router.get('/login', user.login);                     // Edit current user form
router.post('/login', user.doLogin);                  // Edit current user action
// PROJECT ROUTERS
router.get('/project/new', project.create);           // Create new project form
router.post('/project/new', project.doCreate);        // Create new project action
router.get('/project/:id', project.displayInfo);      // Display project info
router.get('/project/edit/:id', project.edit);        // Edit selected project form
router.post('/project/edit/:id', project.doEdit);     // Edit selected project action
router.get('/project/delete/:id', project.confirmDelete);           // Delete selected project form
router.post('/project/delete/:id', project.doDelete);               // Delete selected project action
router.get('/project/byuser/:userid', project.byUser);              // Projects created by a user
router.get('/project/:id/task/new', project.createTask);            // Create new task form
router.post('/project/:id/task/new', project.doCreateTask);         // Create new task action
router.get('/project/:id/task/edit/:taskID', project.editTask);                 // Edit task form
router.post('/project/:id/task/edit/:taskID', project.doEditTask);              // Edit task action
router.get('/project/:id/task/delete/:taskID', project.confirmDeleteTask);      // Delete task form
router.post('/project/:id/task/delete/:taskID', project.doDeleteTask);          // Delete task action

module.exports = router;