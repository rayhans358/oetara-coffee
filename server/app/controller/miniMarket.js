const path = require('path');
const fs = require('fs');
const config = require('../config');
const MiniMarket = require('../model/miniMarketModel');

const getAllMiniMarkets = async (req, res, next) => {
  try {
    const miniMarkets = await MiniMarket.find();

    if (!miniMarkets) {
      return res.status(404).json({ 
        error: 'All mini market not found' 
      });
    };

    return res.status(200).json({ 
      data: miniMarkets 
    });

  } catch (error) {
    console.error('Error getting all mini market data:', error);
    next(error);
    return res.status(500).json({
      error: 'Internal Server Error' 
    });
  };
};

const getMiniMarketById = async (req, res, next) => {
  try {
    const miniMarketId = req.req.params.id;
    const miniMarket = await MiniMarket.findById(miniMarketId);

    if (!miniMarket) {
      return res.status(404).json({ 
        error: 'Mini Market not found' 
      });
    };

    return res.status(200).json({
      data: miniMarket
    });
    
  } catch (wee) {
    console.error('Error getting mini market by id:', error);
    next(error);
    return res.status(500).json({
      error: 'Internal Server Error' 
    });
  };
};

const postNameMiniMarket = async(req, res, next) => {
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
      const target_path = path.resolve(config.rootpath, `public/images/minimarkets/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          const newMiniMarket = new MiniMarket({
            ...payload, 
            image_url: filename
          })
          await newMiniMarket.save()
          return res.status(201).json({ 
            data: newMiniMarket 
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
      const newMiniMarket = new MiniMarket(payload);
      await newMiniMarket.save();
      return res.status(201).json({ 
        data: newMiniMarket 
      });
    };

  } catch (error) {
    console.error('Error saving mini market data:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const putUpdateMiniMarket = async(req, res, next) => {
  try {
    const miniMarketId = req.params.id;
    const payload = req.body;

    if(req.file) {
      const temp_path = req.file.path;
      const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      const filename = req.file.filename + '.' + originalExt;
      const target_path = path.resolve(config.rootpath, `public/images/minimarkets/${filename}`);

      const updateMiniMarket = await MiniMarket.findById(miniMarketId);
      const currentImage = `${config.rootpath}/public/images/minimarkets/${updateMiniMarket.image_url}`; 

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async() => {
        try {
          if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          };

          const updateMiniMarket = await MiniMarket.findByIdAndUpdate(
            miniMarketId, 
            payload, 
            { new: true }
          );
          updateMiniMarket.image_url = filename;
          await updateMiniMarket.save();
          return res.status(200).json({ 
            data: updateMiniMarket
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
      const updateMiniMarket = await MiniMarket.findByIdAndUpdate(
        miniMarketId, 
        payload, 
        { new: true }
      );

      if (!updateMiniMarket) {
        return res.status(404).json({
          error: 'Mini Market not found'
        });
      };

      return res.status(200).json({ 
        data: updateMiniMarket
      });
    };

  } catch (error) {
    console.error('Error updating mini market data:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

const deleteMiniMarketById = async(req, res, next) => {
  try {
    const miniMarketId = req.params.id;
    const deleteMiniMarket = await MiniMarket.findByIdAndDelete(miniMarketId);
    const currentImage = `${config.rootpath}/public/images/minimarkets/${deleteMiniMarket.image_url}`;

    if (!deleteMiniMarket) {
      return res.status(404).json({ 
        error: 'MiniMarket not found' 
      });
    };

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    };

    return res.status(200).json({ 
      data: deleteMiniMarket 
    });

  } catch (error) {
    console.error('Error deleting mini market by id:', error);
    next(error);
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  };
};

module.exports = {
  getAllMiniMarkets,
  getMiniMarketById,
  postNameMiniMarket,
  putUpdateMiniMarket,
  deleteMiniMarketById
}