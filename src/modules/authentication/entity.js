function entity({ validator }) {
  return {
    /**
     * Login
     * @param {Object} data 
     * @returns {Object} { email, password }
     */
    makeLogin: function (data) {
      const schema = validator.object({
        email: validator.string().max(40).email().required(),
        password: validator.string().max(40).required()
      })

      const { value, error } = schema.validate(data, { abortEarly: false })
      if (error) throw { name: 'dataValidationError', details: error.details }

      const { email, password } = value

      return Object.freeze({
        email, password
      })
    },
  }
}

module.exports = entity