import express from 'express';
import Category from '../Models/categoryModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdminOrSelf } from '../util.js';
import multer from 'multer';
import { uploadDoc } from './userRouter.js';
const upload = multer();
const categoryRouter = express.Router();

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.find();
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

// get single category
categoryRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id).sort({ createdAt: -1 });
      if (!category) {
        res.status(400).json({ message: 'category not found' });
      }
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

categoryRouter.post(
  '/',
  isAuth,
  isAdminOrSelf,
  upload.single('categoryImage'),
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.file) {
        const profile_picture = await uploadDoc(req);
        req.body.categoryImage = profile_picture;
      }
      function capitalizeFirstLetter(data) {
        return data.charAt(0).toUpperCase() + data.slice(1);
      }
      //const user = await User.find();
      const newcategory = new Category({
        categoryName: capitalizeFirstLetter(req.body.categoryName),
        categoryDescription: capitalizeFirstLetter(req.body.categoryDescription),
        categoryImage: req.body.categoryImage,
        categoryStatus: req.body.categoryStatus,
        createdDate: req.body.createdDate,
      });

      const category = await newcategory.save();
      const { ...other } = category._doc;
      res
        .status(201)
        .send({ message: 'Category Created successfully.', other });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  })
);

categoryRouter.delete(
  '/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json('category has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);

categoryRouter.put(
  '/update/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      console.log('category', category);
      // const { categoryName, categoryDescription, categoryImage, categoryStatus } = req.body;
      // function capitalizeFirstLetter(data) {
      //   return data.charAt(0).toUpperCase() + data.slice(1);
      // }
      // const updateData = {
      //   categoryName: capitalizeFirstLetter(categoryName),
      //   categoryDescription: capitalizeFirstLetter(categoryDescription),
      //   categoryImage,
      //   categoryStatus
      // }
      await category.updateOne({ $set: req.body });
      res.status(200).json('Category update successfully');
    } catch (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again',
        error: err,
      });
    }
  })
);

categoryRouter.put(
  '/CategoryUpdate/:id',
  isAuth,
  upload.single('file'),
  expressAsyncHandler(async (req, res) => {
    try {
      const categorydata = await Category.findById(req.params.id);
      if (categorydata) {
        if (req.file) {
          const categoryImage = await uploadDoc(req);
          req.body.categoryImage = categoryImage;
        }
        const { categoryName, categoryDescription, categoryImage, categoryStatus } = req.body;
        function capitalizeFirstLetter(data) {
          return data.charAt(0).toUpperCase() + data.slice(1);
        }
        const updateData = {
          categoryName: capitalizeFirstLetter(categoryName),
          categoryDescription: capitalizeFirstLetter(categoryDescription),
          categoryImage,
          categoryStatus
        }
        const updatedCat = await Category.findOneAndUpdate(
          { _id: req.params.id },
          { $set: updateData },
          { new: true }
        );

        res.send({
          updatedCat,
        });
      } else {
        res.status(404).send({ message: 'Category not found' });
      }
    } catch (error) {
      console.log('Error ', error);
    }
  })
);

export default categoryRouter;
