let mongoose = require('mongoose');
let validator = require('validator');
let Schema = mongoose.Schema;

const clinicalTrialSchema = new Schema({
    nctId:{
        type:String,
        required:[true,'NCT ID is required'],
        unique:true,
        trim:true,
        uppercase:true,
        minlength: [3, "NCT ID must be at least 8 characters"],
    },
     title: {
      type: String,
      required: [true, 'Trial title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },

    condition: {
      type: String,
      required: [true, 'Condition name is required'],
      trim: true,
      index: true,
    },

    phase: {
      type: String,
      enum: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Not Applicable'],
      required: [true, 'Trial phase is required'],
    },

    status: {
      type: String,
      enum: [
        'Recruiting',
        'Active',
        'Completed',
        'Suspended',
        'Terminated',
        'Withdrawn',
        'Not yet recruiting',
      ],
      default: 'Recruiting',
      required: [true, 'Trial status is required'],
      index: true,
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [30, 'Description must be at least 30 characters'],
    },

    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true,
      minlength: [10, 'Eligibility must be at least 10 characters'],
    },

    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator information is required'],
    },

    participants: {
      enrolled: {
        type: Number,
        default: 0,
        min: [0, 'Enrolled participants cannot be negative'],
      },
      target: {
        type: Number,
        default: 0,
        min: [0, 'Target participants cannot be negative'],
      },
      pending: {
        type: Number,
        default: 0,
        min: [0, 'Pending participants cannot be negative'],
      },
    },

    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 15,
        message: 'Maximum 15 tags allowed',
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
// ✅ Text Index for Smart Searching
//
clinicalTrialSchema.index({
  title: 'text',
  condition: 'text',
  description: 'text',
  location: 'text',
});

//
// ✅ Virtual: shortDescription (for previews)
//
clinicalTrialSchema.virtual('shortDescription').get(function () {
  if (!this.description) return '';
  return this.description.length > 200
    ? this.description.substring(0, 200) + '...'
    : this.description;
});

//
// ✅ Pre-save hook to update `updatedAt`
//
clinicalTrialSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

//
// ✅ Pre-validate hook to auto-calc pending participants
//
clinicalTrialSchema.pre('validate', function (next) {
  if (this.participants.target && this.participants.enrolled) {
    this.participants.pending = Math.max(
      this.participants.target - this.participants.enrolled,
      0
    );
  }
  next();
});

//
// ✅ Model Export
//
const ClinicalTrial = mongoose.model('ClinicalTrial', clinicalTrialSchema);
module.exports = ClinicalTrial;

