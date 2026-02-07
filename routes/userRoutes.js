const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout,
} = require('../controllers/authController');

//Users route
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.use(protect); // Protect all routes after this middleware as middleware runs in sequence

router.patch('/updateMyPassword', updatePassword);

router.get('/me', getMe, getUserById);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin')); // Restrict all routes after this middleware to admin only

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
