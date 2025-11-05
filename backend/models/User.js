let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let validator = require('validator');
let Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true,
        minlength:3,
        maxlength:70,
        index:true,
    },
    email:{
        type:String,
        required:[true,'Please add a email'],
        unique:true,
        trim:true,
        validate:[validator.isEmail,'Please add a valid email'],
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false,
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(el){
                return el === this.password;
            },
            message:'Passwords are not the same'
        }
    },
    userType:{
        type:String,
        enum:['patient', 'researcher'],
        validate:{
            validator:function(el){
                return el === 'patient' || el === 'researcher';
            },
            message:'User type is not valid'
        },
        required:[true,'Please add a user type'],
    },

       googleId: { type: String },
    avatar: { type: String },

      patientProfile: {
    condition: String,
    additionalConditions: [String],
    interests: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
      address: String,
      city: String,
      state: String,
      district: String,
      postalCode: String,
      country: String,
    },
  },
 researcherProfile: {
  institution: {
    type: String,
    trim: true,
  },
  specialties: {
    type: [String], // multiple specialties allowed
    validate: {
      validator: function (arr) {
       if (this.userType === 'researcher') {
        return Array.isArray(arr) && arr.length > 0;
      }
      return true
      },
      message: "Please add at least one specialty.",
    },
  },
  researchInterests: {
    type: [String], // e.g. ["AI in Medicine", "Molecular Biology"]
    default: [],
  },
  orcid: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(\d{4}-){3}\d{3}[\dX]$/.test(v) || v === ""; // ORCID format check
      },
      message: "Please provide a valid ORCID ID (e.g., 0000-0002-1825-0097)",
    },
  },
  researchGate: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return (
          v === "" ||
          /^https?:\/\/(www\.)?researchgate\.net\/profile\/[A-Za-z0-9._-]+\/?$/.test(v)
        );
      },
      message: "Please provide a valid ResearchGate profile URL.",
    },
  },
  availableForMeetings: {
    type: Boolean,
    default: false,
  },
  publications: [
    {
      title: {
        type: String,
        required: [true, "Publication title is required."],
        trim: true,
      },
      journal: {
        type: String,
        trim: true,
      },
      year: {
        type: Number,
        min: [1900, "Please enter a valid year."],
        max: [new Date().getFullYear(), "Year cannot be in the future."],
      },
      link: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return v === "" || validator.isURL(v);
          },
          message: "Please provide a valid URL for the publication.",
        },
      },
    },
  ],
},
favorites:[
    {
        itemId:{
            type:mongoose.Schema.Types.ObjectId,
            refPath:'itemType',
            required:[true,'Please add an item id'],
        },
        itemType:{
            type:String,
            enum:['trial', 'expert', 'publication'],
            required:[true,'Please add an item type'],
        },
        addedAt:{
            type:Date,
            default:Date.now,
            immutable:true,

        }
    }
],

isActive:{
type:Boolean,
default:true,
index:true,
},


},{timestamps:true,}

)

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

let User = mongoose.model('User',userSchema);

module.exports = User;

