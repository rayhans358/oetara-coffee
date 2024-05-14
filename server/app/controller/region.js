const { provinsi, kabupaten, kecamatan, desa } = require("daftar-wilayah-indonesia");

const getProvince = async (req, res, next) => {
  try {
    return res.status(200).json({
      data: provinsi()
    });

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

const getRegency = async (req, res, next) => {
  const { code } = req.query;

  try {
    return res.status(200).json({
      data: kabupaten(code)
    });

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

const getDistrict = async (req, res, next) => {
  const { code } = req.query;

  try {
    return res.status(200).json({
      data: kecamatan(code)
    });

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

const getVillage = async (req, res, next) => {
  const { code } = req.query;

  try {
    return res.status(200).json({
      data: desa(code)
    });

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
  getProvince,
  getRegency,
  getDistrict,
  getVillage
}