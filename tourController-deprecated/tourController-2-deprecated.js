const Tour = require('../models/tourModel');

//Middleware to alias top 5 cheap tours
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Get all tours
exports.getAllTours = async (req, res) => {
  try {
    //Hardcoded query example
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    //Method chaining example
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //1. Filtering - remove special query parameters for other features like sorting, pagination, field limiting etc
    const queryObj = { ...req.query }; //destructuring and making a copy to avoid changing the original req.query object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj); //OP - { duration: '5', difficulty: 'easy' }

    //2. Advanced Filtering - Chnaging query operators to match MongoDB operators
    // Replace { difficulty: 'easy', duration: { gte: '5' } (Normal query)  --> { difficulty: 'easy', duration: { $gte: '5' } } (MongoDB query)
    let queryStr = JSON.stringify(queryObj); // Convert to string to use replace method
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // \b is word boundary to match exact words only
    // console.log(JSON.parse(queryStr)); - {"duration":{"$gte":"5"},"difficulty":"easy","price":{"$lt":"1500"}}

    let query = Tour.find(JSON.parse(queryStr)); //prev - Tour.find(queryObj) Need to append more query features like sorting, pagination, field limiting etc and then await all together and now JSON.parse() to convert back to object

    //3. Sorting
    // req.query.sort = { sort: 'price' }   http://localhost:3000/api/v1/tours?sort=price
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //for multiple sort criteria - sort=price,ratingsAverage
      query = query.sort(sortBy); // e.g. .sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt'); //default sort by newest tours (- for descending order)
    }

    //4. Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' '); //for multiple fields - fields=name,duration,price
      query = query.select(fields); //e.g. .select('name duration price')
    } else {
      query = query.select('-__v'); //exclude __v field by default
    }

    //5. Pagination
    const page = req.query.page * 1 || 1; //default page 1 (* 1 to convert to number)
    const limit = req.query.limit * 1 || 10; //default 10 results per page
    const skip = (page - 1) * limit; //skips no of results

    //If requested page is out of range
    if (req.query.page) {
      const numTours = await Tour.countDocuments(); //total no of documents in collection
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    query = query.skip(skip).limit(limit);

    const tours = await query;

    res.status(200).json({
      requestedAt: req.requestTime,
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

//Get a specific tour by ID
exports.getTourById = async (req, res) => {
  try {
    //Another method - Tour.findOne({ _id: req.params.id });
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

//Create a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

//Update a tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

//Delete a tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
