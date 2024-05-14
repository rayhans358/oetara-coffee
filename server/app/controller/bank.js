const path = require('path');
const fs = require('fs');
const config = require('../config');
const Bank = require("../model/bankModel");

const getAllBanks = async (req, res, next) => {
  try {
    const banks = await Bank.find();

    if (!banks) {
      return res.status(404).json({
        error: 1,
        message: 'All banks not found'
      });
    };

    return res.status(200).json({ 
      data: banks 
    });

  } catch (error) {
    console.error('Error getting all bank data:', error);
    next(error);
    return res.status(500).json({
      error: 'Internal Server Error' 
    });
  };
};

const getBankById = async (req, res, next) => {
  try {
    const bankId = req.params.id;
    const bank = await Bank.findById(bankId);

    if (!bank) {
      return res.status(404).json({ 
        error: 'Bank not found' 
      });
    };
    
    return res.status(200).json({ 
      data: bank 
    });

  } catch (error) {
    console.error('Error getting bank by id:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const postNameBank = async(req, res, next) => {
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
      const target_path = path.resolve(config.rootpath, `public/images/banks/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          const newBank = new Bank({
            ...payload, 
            image_url: filename
          })
          await newBank.save()
          return res.status(201).json({ 
            data: newBank 
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
      const newBank = new Bank(payload);
      await newBank.save();
      return res.status(201).json({ 
        data: newBank 
      });
    };

  } catch (error) {
    console.error('Error saving bank data:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const putUpdateBank = async(req, res, next) => {
  try {
    const bankId = req.params.id;
    const payload = req.body;

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/banks/${filename}`);

      const updateBank = await Bank.findById(bankId);
      const currentImage = `${config.rootpath}/public/images/banks/${updateBank.image_url}`; 

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          };

          const updateBank = await Bank.findByIdAndUpdate(
            bankId, 
            payload, 
            { new: true }
          );
          updateBank.image_url = filename;
          await updateBank.save();
          return res.status(200).json({ 
            data: updateBank
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
      const updateBank = await Bank.findByIdAndUpdate(
        bankId, 
        payload, 
        { new: true }
      );

      if (!updateBank) {
        return res.status(404).json({
          error: 'Bank not found'
        });
      };

      return res.status(200).json({ 
        data: updateBank
      });
    };

  } catch (error) {
    console.error('Error updating bank data:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const deleteBankById = async(req, res, next) => {
  try {
    const bankId = req.params.id;
    const deleteBank = await Bank.findByIdAndDelete(bankId);
    const currentImage = `${config.rootpath}/public/images/banks/${deleteBank.image_url}`;

    if (!deleteBank) {
      return res.status(404).json({ 
        error: 'Bank not found' 
      });
    };

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    };

    return res.status(200).json({ 
      data: deleteBank 
    });

  } catch (error) {
    console.error('Error deleting bank by id:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

module.exports = {
  getAllBanks,
  getBankById,
  postNameBank,
  putUpdateBank,
  deleteBankById
}