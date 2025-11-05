// let mongoose = require('mongoose');
// let validator = require('validator');
// let Schema = mongoose.Schema;

// let replySchema = new Schema({
//     author:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User',
//         required:[true,'Reply author is required'],
//     },
//     content:{
//         type:String,
//         required:[true,'Reply content is required'],
//         trim:true,
//         minlength:[2,'Reply content must be at least 2 characters'],
//         maxlength:[1000,'Reply content cannot exceed 1000 characters'],
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now,
//         immutable:true,
//     },
//     updatedAt:{
//         type:Date,
//         default:Date.now,
//     },

// },{timestamps:true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
// })

// const forumPostSchema = new Schema({
//     category:{
//         type:String,
//         required:[true,'Category is Required'],
//         enum:{
//             values:[
//                     'Cancer Research',
//                     'Clinical Trials',
//                     'Clinical Studies',
//                     'Medical Devices',                    
//                     'Public Health',
//                     'Genetics',
//                     'Biotechnology',
//                     'Healthcare Policy',
//                     'Medical Ethics',
//                     'Drug Development',
//                     'Other'
//             ],
//             message:'Invalid Category Must be one of the following '
//         }
//     },
//     author:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User',
//         required:[true,'Post auther is required'],
//     },
//     title:{
//         type:String,
//         required:[true,'Post title is required'],
//         trim:true,
//         minlength:[5,'Post title must be at least 5 characters'],
//         maxlength:[200,'Post title cannot exceed 200 characters'],
//     },
//     content:{
//         type:String,
//         required:[true,'Post content is required'],
//         trim:true,
//         minlength:[20,'Post content must be at least 20 characters'],
//         maxlength:[6000,'Post content cannot exceed 6000 characters'],
//     },
//     replies:{
//         type:[replySchema],
//         default:[],
//     },
//     views:{
//         type:Number,
//         default:0,
//         min:[0,'Views cannot be negative'],
//     },
//     isActive:{
//         type:Boolean,
//         default:true,
//         index:true,
//     },

// },{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})    


// // Text Search Index
// forumPostSchema.index({
//     title:'text',
//     content:'text',
//     category:'text',
// })

// // Virtual field: Short content preview

// forumPostSchema.virtual('shortContent').get(function(){
//     if(!this.content)return '';
//     return this.content.length >150    ? this.content.substring(0,150) + '...'
//     : this.content;
// })

// // Pre-save hook to update `updatedAt` for the post
// forumPostSchema.pre('save',function(next){
//     this.updatedAt = Date.now();
//     next();
// })

// // Pre-save hook to update `updatedAt` for replies
// replySchema.pre('save',function(next){
//     this.updatedAt = Date.now();
//     next();
    
// })


// let ForumPost = mongoose.model('ForumPost',forumPostSchema);

// module.exports = ForumPost;



let mongoose = require('mongoose');
let validator = require('validator');
let Schema = mongoose.Schema;

let replySchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reply author is required'],
  },
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    trim: true,
    minlength: [2, 'Reply content must be at least 2 characters'],
    maxlength: [1000, 'Reply content cannot exceed 1000 characters'],
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

let forumPostSchema = new Schema({
  category: {
    type: String,
    required: [true, 'Category is Required'],
    enum: {
      values: [
        'Cancer Research',
        'Clinical Trials',
        'Clinical Studies',
        'Medical Devices',
        'Public Health',
        'Genetics',
        'Biotechnology',
        'Healthcare Policy',
        'Medical Ethics',
        'Drug Development',
        'Other'
      ],
      message: 'Invalid category',
    },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post author is required'],
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    minlength: [20, 'Content must be at least 20 characters'],
    maxlength: [6000, 'Content cannot exceed 6000 characters'],
  },
  replies: { type: [replySchema], default: [] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// 🔍 Text index for searching
forumPostSchema.index({ title: 'text', content: 'text', category: 'text' });

// 🔹 Virtual fields
forumPostSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});
forumPostSchema.virtual('dislikeCount').get(function () {
  return this.dislikes.length;
});
forumPostSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

let ForumPost = mongoose.model('ForumPost', forumPostSchema);
module.exports = ForumPost;
