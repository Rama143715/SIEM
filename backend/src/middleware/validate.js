const Joi = require("joi");

function validate(schema, target = "body") {
  return (request, response, next) => {
    const { error, value } = schema.validate(request[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return response.status(400).json({
        error: "Validation failed.",
        details: error.details.map((detail) => detail.message),
      });
    }

    request[target] = value;
    return next();
  };
}

module.exports = {
  Joi,
  validate,
};