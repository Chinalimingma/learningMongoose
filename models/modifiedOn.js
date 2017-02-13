var mongoose = require( 'mongoose' );
module.exports = exports = function modifiedOn (schema, options) {
    schema.add({ modifiedOn: Date });
    schema.pre('save', function (next) {
        this.modifiedOn = Date.now();
        next();
    });
};
/* **********
    Do two things, which are:
    • Add the modifiedOn path with a SchemaType of Date
    • Set the value to be the current date and time just before the document
    is saved
************* */