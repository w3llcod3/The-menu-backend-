function entity({ validator }) {
  return {
    /**
     * Create menu node
     * @param {Object} data 
     * @returns {Object} { title, description, status, file, users, createdAt }
     */
    makeCreate: function (data) {
      const schema = validator.object({
        type: validator.string().valid('category', 'subcategory', 'item').required(),
        name: validator.string().max(100).required(),
        discount: validator.number().integer().min(0).max(100),
        parent: validator
          .any()
          .when('type', { is: 'subcategory', then: validator.string().required() })
          .when('type', { is: 'item', then: validator.string().required() }),
      })

      const { value, error } = schema.validate(data, { abortEarly: false })
      if (error) throw { name: 'dataValidationError', details: error.details }

      const { type, name, discount, parent } = value

      return Object.freeze({
        type, name, discount, parent, createdAt: new Date(),
      })
    },

    /**
     * Update menu node
     * @param {Object} data 
     * @returns {Object}
     */
    makeUpdate: function (data) {
      const schema = validator.object({
        _id: validator.string().required(),
        type: validator.string().valid('category', 'subcategory', 'item').required(),
        name: validator.string().max(100).required(),
        discount: validator.number().integer().min(0),
        parent: validator
          .any()
          .when('type', { is: 'subcategory', then: validator.string().required() })
          .when('type', { is: 'item', then: validator.string().required() }),
      })

      const { value, error } = schema.validate(data, { abortEarly: false })
      if (error) throw { name: 'dataValidationError', details: error.details }

      let { _id, type, name, discount, parent } = value

      return Object.freeze({
        _id, type, name, discount: Number(discount), parent, modifiedAt: new Date(),
      })
    },

    /**
     * Get menu node
     * @param {Object} data 
     * @returns {Object}
     */
    makeGet: function (data) {
      const schema = validator.object({
        _id: validator.string(),
        parent: validator.string().allow(null),
      })
        .oxor('_id', 'parent')

      const { value, error } = schema.validate(data, { abortEarly: false })
      if (error) throw { name: 'dataValidationError', details: error.details }

      const { _id, parent } = value

      return Object.freeze({
        ..._id !== undefined && { _id },
        ...parent !== undefined && { parent },
      })
    },

    /**
     * Delete menu node
     * @param {Object} data 
     * @returns {Object}
     */
    makeDelete: function (data) {
      const schema = validator.object({
        _id: validator.string().required(),
      })

      const { value, error } = schema.validate(data, { abortEarly: false })
      if (error) throw { name: 'dataValidationError', details: error.details }

      const { _id } = value

      return Object.freeze({
        _id
      })
    },
  }
}

module.exports = entity