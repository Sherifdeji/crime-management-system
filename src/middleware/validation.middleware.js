const Joi = require("joi");

// Registration validation schema
const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .regex(/[a-z]/, "lowercase letter")
    .regex(/[A-Z]/, "uppercase letter")
    .regex(/[0-9]/, "number")
    .regex(/[\W_]/, "special character")
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 32 characters long",
      "string.pattern.name": "Password must include at least one {#name}",
    }),
  role: Joi.string().valid("ADMIN", "OFFICER", "INVESTIGATOR").required(),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
});

// Middleware for validation
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
};
