"use strict"

// Bring Mongoose into the project
var mongoose = require( 'mongoose' );

/* *************************************
    built-in Mongoose validators
    required: used by any Schema type

    Number: built-in min and max validators
    String: built-in match and enum validators

****************************************** */
/* *****************************************
  schema plugin
******************************************** */
var creationInfo = require('./creationInfo');

/* *****************************************
  schema middleware
  • pre: This middleware is for before the method has completed
  • post: This is for after the method has completed
  Use these to hook into the methods save, init, validate, and remove.
******************************************** */
var modifiedOn = require('./modifiedOn');


/* ********************************************
      USER SCHEMA
   ******************************************** */
var userSchema = new mongoose.Schema({
  name: String,
  email: {type: String, unique:true, required: true},
  age: {type: Number, min: 13, max: 70},
  //modifiedOn: Date,
  createdOn: { type: Date, default: Date.now },
  lastLogin: Date
});

userSchema.path('name').validate(/^[a-z]+$/i, 'Letters only');

/* ********************************************
      PROJECT SCHEMA
   ******************************************** */
var weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
var validateLength = function(value){ };

//Subdocuments
var taskSchema = new mongoose.Schema({
  taskName: {type: String, required: true, validate: validateLength},
  taskDesc: String,  
  //modifiedOn: Date,
  assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
taskSchema.plugin(creationInfo)

var projectSchema = new mongoose.Schema({
  projectName: String,
  //modifiedOn: Date,  
  contributors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  orderedOn: {day: {type: String, enum: weekdays }},  
  tasks: [taskSchema]
});
projectSchema.plugin(creationInfo);

userSchema.plugin(modifiedOn);
projectSchema.plugin(modifiedOn);
taskSchema.plugin(modifiedOn);

/* *************************************************
Built-in CRUD static methods
*******************
1. Creation     
    ModelName.create(dataObject, callback)
2. Reading, Querying, and Finding
   --QueryBuilder
    ModelName.find.Where.Sort.Exec...
   --Single query operation
    ModelName.find(conditions, [fields], [Options], [callback])
   --Static helper methods
    ModelName.find(query)
    ModelName.findOne(query)
    ModelName.findById(ObjectID) 
 3. Updating
    ModelName.update(conditions, [updatefields], [Options], [callback])
    ---Opetion: safe, upsert, multi, strict

    ModelName.findOneAndUpdate(conditions, [updatefields], [Options], [callback])
    ModelName.findByIdAndUpdate(conditions, [updatefields], [Options], [callback])
    --Opetion: new, upsert, sort, select
    
    The three-step find-edit-save approach
    //// 1: FIND the record
    ModelName.find(conditions, function(err, model){
      ........
      if(!err){
        //2: EDIT the record
        model.property = 
        .......
        //3: SAVE the record
        model.save(function(err, model){
          ......
        })
      }
    })
4. Deleting
   ModelName.remove(query, [callback])
   ModelName.findOneAndRemove(query, options, [callback])
   ModelName.findByIdAndRemove()

***********************
Instance methods
***********************
    save
    remove

************************************************************* */


//Do static methods after the schema is declared, but before the model is compiled.
projectSchema.statics.findByUserID = function(userid, cb){
  this.find(
    {createdBy: userid}     //Query object
  , "_id projectName"       //Items to select and return
  , {sort: "modifiedOn"}    //Options (in this case a sort order)
  , cb                      //A callback function
  );
}


// Build the User model
mongoose.model( 'User', userSchema );

// Build the Project model
mongoose.model( 'Project', projectSchema );

/**
 *******Using the QueryBuilder
var myQuery = User.find({'name' : 'Simon Holmes'});//name is "Simon Holmes"
//If no callback function is defined then the query will not be executed. It can however be 
//called explicitly by using the .exec()
method we saw earlier.
myQuery.where('age').gt(18); //older than 18 years
myQuery.sort('-lastLogin');//order them by lastLogin in a descending order
myQuery.select('_id name email');//return the three document fields _id, name, and email.
myQuery.exec(function (err, users){
if (!err){
  console.log(users); // output array of users found
}
}); 

User.find({'name' : 'Simon Holmes'})
  .where('age').gt(18)
  .sort('-lastLogin')
  .select('_id name email')
  .exec(function (err, users){
  if (!err){
    console.log(users); // output array of users found
  }
});

//Single query operation
//fields and options are both optional, but if you want to specify options then you must 
//specify fields, even if you send it as null.
Model.find(conditions, [fields], [options], [callback]);

User.find(
  {'name' : 'Simon Holmes'},      // users called Simon Holmes
  null,                           // returning all fields in model
  {sort : {lastLogin : -1}},      // sorted by lastLogin descending
  function (err, users){
    if (!err){console.log(users);}
});

//Static helper methods
• Model.find(query) to return an array of instances matching the query
• Model.findOne(query) to return the first instance found that matches the query
• Model.findById(ObjectID) to return a single instance matching the given ObjectID

 */








