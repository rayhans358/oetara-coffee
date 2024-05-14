const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils/policies");
const Invoice = require("../model/invoiceModel");

const getInvoice = async(req, res, next) => {
  try {
    let policy = policyFor(req.user);
    let subjectInvoice = subject('Invoice', {
      ...invoice, 
      user_id: invoice.user._id
    });
    if (!policy.can('read', subjectInvoice)) {
      return res.status(400).json({
        error: 1,
        message: `You do not have access to read this invoice`
      });
    };

    let { order_id } = req.params;
    let orderId = { order: order_id }
    let invoice = await Invoice
      .findOne(orderId)
      .populate('order')
      .populate('user');

    if (!invoice) {
      return res.status(400).json({
        error: 1,
        message: 'Invoice not found',
      });
    };
    
    return res.status(200).json(invoice);
    
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
  getInvoice
}