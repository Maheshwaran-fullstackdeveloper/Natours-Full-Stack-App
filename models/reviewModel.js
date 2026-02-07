const mongoose = require('mongoose');
const Tour = require('./tourModel');
const { clean } = require('xss-clean/lib/xss');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating is required!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 1 is the default one. we just need to ensure that each combination of tour and user is unique
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Statics are available on the Model itself
// Use statics if this should point to current Model
// Aggregate methods should be called on the model and not on query so we use statics here
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this = Review model
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
  });
};

//cannot directly call calcAverageRatings static methods on a post document middleware so this.constructor refers to the Model since static methods can be called on  Model only
reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// We need to update a document but query middleware does not have access to the document being updated instead has only access to the query so we use findOne() on query which gives us the document
// findByIdAndUpdate and findByIdAndDelete are shorthand for findOneAndUpdate and findOneAndDelete respectively
//Mongoose no longer allows executing the same query object twice so we need to clone() it because the query will be already executed once in the pre and again in the actual controller
// We used to only append query in query middleware and not execute it immediately but now in order to get the document we need to execute it once in pre middleware so we need to clone it to avoid error

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // const r = await this.clone().findOne();
  this.r = await this.clone().findOne(); // This retuns us the document and appending r to this so that we can access it in post middleware
  next();
});

//cannot directly call calcAverageRatings static methods on a document middleware so this.constructor gives us access to the Model since static methods can be called on  Model only
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
