function db({ MenuNode }) {
  return {
    /**
     * Update node by id
     * @param {String} _id id of node
     * @param {Object} update fields
     * @returns {Object} updated
     */
    commitUpdateNode: async function (_id, { type, name, discount, parent, modifiedAt, ...args }) {
      if (!_id || Object.keys(args).length) throw { name: 'invalidArgs' }

      const item = {
        ...type !== undefined && { type },
        ...name !== undefined && { name },
        ...discount !== undefined && { discount },
        ...parent !== undefined && { parent },
        ...modifiedAt !== undefined && { modifiedAt },
      }

      const updated = await MenuNode
        .findByIdAndUpdate(_id, item, { new: true })
        .populate({ path: 'parent', select: 'type name discount parent createdAt modifiedAt' })
        .lean()

      return updated
    },

    /**
     * Create node
     * @param {Object} { type, name, discount, parent, createdAt }
     * @returns {Oject} created node
     */
    commitCreateNode: async function ({ type, name, discount, parent, createdAt, ...args }) {
      if (Object.keys(args).length) throw { name: 'invalidArgs' }

      const item = {
        ...type !== undefined && { type },
        ...name !== undefined && { name },
        ...discount !== undefined && { discount },
        ...parent !== undefined && { parent },
        ...createdAt !== undefined && { createdAt },
      }

      const created = await MenuNode.create(item)

      return created
    },

    /**
     * Delete node by id
     * @param {String} _id 
     * @returns {Object} deleted node
     */
    commitDeleteNodeById: async function (_id) {
      const node = await MenuNode.findByIdAndDelete(_id)

      return node
    },

    /**
     * Get nodes
     * @param {String} query 
     * @returns {Object}
     */
    getNodes: async function (query, ...args) {
      if (Object.keys(args).length) throw { name: 'invalidArgs' }

      const nodes = await MenuNode.find(query)
        .populate({ path: 'parent', select: 'type name discount parent createdAt modifiedAt' })
        .lean()

      return nodes
    },
  }
}

module.exports = db