const mongoose = require("mongoose");

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ' + url);
mongoose.connect(url)
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.log('error connection to MongoDB' , err.message));

const checkNumberFormat = (number) => {
    const regex = new RegExp('^(\\d{2,3})-(\\d+)$');

    return regex.test(number);
}

const NUMBER_FORMAT_ERROR = 'Please enter a valid phone number in the format XX-XXXXXXX or XXX-XXXXXXX.'

const numberValidator = [checkNumberFormat, NUMBER_FORMAT_ERROR]

const personSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minLength: 3
    },
    number: {
        type:String,
        required: true,
        minLength: 8,
        validate: numberValidator
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