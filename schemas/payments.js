const Joi = require("joi");

const paymentIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const paymentTagSchema = Joi.array().items(Joi.string().max(10));

const createPaymentSchema = {
  name: Joi.string()
    .max(50)
    .required(),
  /*price: Joi.number()
    .min(1)
    .max(1000000),
  image: Joi.string().required(),
  tags: paymentTagSchema*/
};

const updatePaymentSchema = {
  name: Joi.string().max(50),
  /*price: Joi.number()
    .min(1)
    .max(1000000),
  image: Joi.string(),
  tags: paymentTagSchema*/
};

module.exports = {
  paymentIdSchema,
  paymentTagSchema,
  createPaymentSchema,
  updatePaymentSchema
};
