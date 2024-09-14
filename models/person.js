const mongoose = require("mongoose");

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ' + url);
mongoose.connect(url)
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.log('error connection to MongoDB' , err.message));

const personSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    number: {
        type:String,
        required: true
    }
});

// Casted den _id von MongoDB in die id property
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Person', personSchema);