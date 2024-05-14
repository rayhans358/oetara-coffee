const Category = require('../model/categoryModel');

const getAllCategories = async (req, res, next) => {
  try {
    let category = await Category.find();
    if (!category) {
      return res.status(404).json({
        error: 1,
        message: 'All categories not found'
      });
    };
    return res.status(200).json(category);
    
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    };
    next(error);
  };
};

const getCategoryById = async (req, res, next) => {
  let categoryId = req.params.id;

  try {
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        error: 1,
        message: 'Category not found'
      });
    };
    return res.status(200).json(category);

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    };
    next(error);
  };
};

const postCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.status(201).json(category);

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    };
    next(error);
  };
};

const putUpdateCategory = async (req, res, next) => {
  let categoryId = req.params.id;

  try {
    let payload = req.body;
    let category = await Category
      .findByIdAndUpdate(
        categoryId, 
        payload, 
        { new: true, runValidators: true }
      );
    return res.status(200).json(category);

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    };
    next(error);
  };
};

const deleteCategoryByid = async (req,res, next) => {
  let categoryId = req.params.id;

  try {
    let category = await Category.findByIdAndDelete(categoryId);
    return res.status(200).json(category);

  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.status(400).json ({
        error: 1,
        message: error.message,
        fields: error.errors
      });
    };
    next(error);
  };
};

module.exports = {
  getAllCategories,
  getCategoryById,
  postCategory,
  putUpdateCategory,
  deleteCategoryByid
}