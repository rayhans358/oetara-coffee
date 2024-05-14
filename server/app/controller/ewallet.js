const path = require('path');
const fs = require('fs');
const config = require('../config');
const Ewallet = require('../model/ewallet');

const getAllEwallets = async (req, res, next) => {
  try {
    const ewallets = await Ewallet.find();

    if (!ewallets) {
      return res.status(404).json({ 
        error: 'All ewallet not found' 
      });
    };

    return res.status(200).json({ 
      data: ewallets 
    });

  } catch (error) {
    console.error('Error getting all ewallet data:', error);
    next(error);
    return res.status(500).json({
      error: 'Internal Server Error' 
    });
  };
};

const getEwalletById = async (req, res, next) => {
  try {
    const ewalletId = req.req.params.id;
    const ewallet = await Ewallet.findById(ewalletId);

    if (!ewallet) {
      return res.status(404).json({ 
        error: 'Ewallet not found' 
      });
    };

    return res.status(200).json({
      data: ewallet
    });
    
  } catch (wee) {
    console.error('Error getting ewallet by id:', error);
    next(error);
    return res.status(500).json({
      error: 'Internal Server Error' 
    });
  };
};

const postNameEwallet = async(req, res, next) => {
  try {
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({ 
        error: 'Name and image are required' 
      });
    };

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/ewallets/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          const newEwallet = new Ewallet({
            ...payload, 
            image_url: filename
          })
          await newEwallet.save()
          return res.status(201).json({ 
            data: newEwallet 
          });

        } catch(error) {
          fs.unlinkSync(target_path);
          next(error);
        };
      });

      src.on('error', async() => {
        next(error);
      });
      
    } else {
      const newEwallet = new Ewallet(payload);
      await newEwallet.save();
      return res.status(201).json({ 
        data: newEwallet 
      });
    };

  } catch (error) {
    console.error('Error saving ewallet data:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const putUpdateEwallet = async(req, res, next) => {
  try {
    const ewalletId = req.params.id;
    const payload = req.body;

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/ewallets/${filename}`);

      const updateEwallet = await Ewallet.findById(ewalletId);
      const currentImage = `${config.rootpath}/public/images/ewallets/${updateEwallet.image_url}`; 

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          };

          const updateEwallet = await Ewallet.findByIdAndUpdate(
            ewalletId, 
            payload, 
            { new: true }
          );
          updateEwallet.image_url = filename;
          await updateEwallet.save();
          return res.status(200).json({ 
            data: updateEwallet
          });

        } catch(error) {
          fs.unlinkSync(target_path);
          next(error);
        };
      });

      src.on('error', async() => {
        next(error);
      });

    } else {
      const updateEwallet = await Ewallet.findByIdAndUpdate(
        ewalletId, 
        payload, 
        { new: true }
      );

      if (!updateEwallet) {
        return res.status(404).json({
          error: 'Ewallet not found'
        });
      };

      return res.status(200).json({ 
        data: updateEwallet
      });
    };

  } catch (error) {
    console.error('Error updating ewallet data:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const deleteEwalletById = async(req, res, next) => {
  try {
    const ewalletId = req.params.id;
    const deleteEwallet = await Ewallet.findByIdAndDelete(ewalletId);
    const currentImage = `${config.rootpath}/public/images/ewallets/${deleteEwallet.image_url}`;

    if (!deleteEwallet) {
      return res.status(404).json({ 
        error: 'Ewallet not found' 
      });
    };

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    };

    return res.status(200).json({ 
      data: deleteEwallet 
    });

  } catch (error) {
    console.error('Error deleting ewallet by id:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

module.exports = {
  getAllEwallets,
  getEwalletById,
  postNameEwallet,
  putUpdateEwallet,
  deleteEwalletById
}