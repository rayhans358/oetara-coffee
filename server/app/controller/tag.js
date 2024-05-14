const Tag = require('../model/tagModel');

const getAllTags = async (req, res, next) => {
  try {
    let tag = await Tag.find();
    if (!tag) {
      return res.status(404).json({
        error: 1,
        message: 'All tags not found'
      });
    };
    return res.status(200).json(tag);

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

const getTagById = async (req, res, next) => {
  let tagById = req.params.id;

  try {
    let tag = await Tag.findById(tagById);
    if (!tag) {
      return res.status(404).json({
        error: 1,
        message: 'Tag not found'
      });
    };
    return res.status(200).json(tag);

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

const postTag = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();
    return res.status(201).json(tag);

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

const putUpdateTag = async (req, res, next) => {
  let tagById = req.params.id;

  try {
    let payload = req.body;
    let tag = await Tag.findByIdAndUpdate(
      tagById, 
      payload, 
      { new: true, runValidators: true }
    );
    return res.status(200).json(tag);

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

const deleteTagByid = async (req, res, next) => {
  let tagById = req.params.id;

  try {
    let tag = await Tag.findByIdAndDelete(tagById);
    return res.status(200).json(tag);

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

module.exports = {
  getAllTags,
  getTagById,
  postTag,
  putUpdateTag,
  deleteTagByid
}