const boom = require("boom");
const debug = require("debug")("app:error");
const { config } = require("../../config");
const isRequestAjaxOrApi = require("../../utils/isRequestAjaxOrApi");

function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack }; // Object.assign({}, err, stack)
  } else {
    return {...err} // can be commented for security
  }
}

function logErrors(err, req, res, next) {
  debug(err.stack);
  next(err);
}

function wrapErrors(err, req, res, next) {
  console.log('CALLING BOOOMMMM!!')
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  console.log('CALLING CLIENT ERROR!!')
  const {
    output: { statusCode, payload }
  } = err;

  // catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    console.log('into')
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  console.log('CALLING ERROR HANDLER!!')
  const {
    output: { statusCode, payload }
  } = err;

  res.status(statusCode);
  //res.render("error", withErrorStack(payload, err.stack));
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler
};
