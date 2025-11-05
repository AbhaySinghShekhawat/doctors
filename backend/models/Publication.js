let mongoose = require('mongoose');
let validator = require('validator');
let Schema = mongoose.Schema;

const publicationSchema = new Schema({
    title:{
        type:String,
        required:[true,'Publication title is required'],
        trim:true,
        minlength: [3, "Title must be at least 3 characters"],
        maxlength: [300, "Title cannot exceed 300 characters"],
    },
    authors:[
        {
            type:String,
            trim:true,
            required:[true,'Author name is required']
        }
    ],
    correspondingAuthor:[
        {
            type:String,
            trim:true,
        }
    ],
    institution:[
        {
            type:String,
            trim:true
        }
    ],
    journal:{
        type:String,
        trim:true,
        required:[true,'Journal name is required'],
    },
    volume:String,
    issue:String,
    pages:String,
    year:{
        type:Number,
        required:[true,'Year is required'],
        min:[1900,'Please enter a valid year'],
        max:[new Date().getFullYear(),'Year cannot be in the future'],
    },
    abstract:{
        type:String,
        trim:true,
        required:[true,'Abstract is required'],
        minlength: [3, "Abstract must be at least 3 characters"],
    },
    link:{
        type:String,
        trim:true,
        required:[true,'Link is required'],
        // validate:{
        //     validator:function(v){
        //         return validator.isURL(v);
        //     },
        //     message:'Please provide a valid URL for the publication',
        // }
    },
    doi:{
        type:String,
        trim:true,
        // validator:{
        //     validator:function(v){  
                
        //       return v === '' || /^(doi:)?(10\.\d{4,}(\.\d+)*\/(\w|\.)+)$/i.test(v);
        //     },
        //     message: 'Please provide a valid DOI (e.g., 10.1007/s00220-004-1263-4)',
        
        // }
    },
    pmid:{
        type:String,
        trim:true,
    },
    condition:{
        type:String,
        trim:true,
        index:true,
        require:[true,'Condition is required'],
    },
    keywords:{
        type:[String],
        default:[],
         validate: {
        validator: (arr) => arr.length <= 15,
        message: "Maximum 15 keywords allowed",
      },
      index: true,
    },
    citations:{
        type:Number,
        default:0,
        min: [0, "Citations cannot be negative"],
    },
    publisher:{
        type:String,
        trim:true,
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    isPeerReviewed:{
        type:Boolean,
        default:false,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        immutable:true,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
}, {timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
} )

publicationSchema.index({
 title: "text",
  abstract: "text",
  condition: "text",
  journal: "text",
  keywords: "text",
})

publicationSchema.virtual("shortAbstract").get(function(){
    if(!this.abstract)return"";
     return this.abstract.length > 150
    ? this.abstract.substring(0, 150) + "..."
    : this.abstract;
})

publicationSchema.pre('save',function(next){
    this.updatedAt = Date.now();
    next();
})


let Publication = mongoose.model('Publication',publicationSchema);

module.exports = Publication;