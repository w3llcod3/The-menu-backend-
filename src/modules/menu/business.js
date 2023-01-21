function business({ validator, db }) {
  const {
    makeCreate,
    makeUpdate,
    makeGet,
    makeDelete,
  } = require('./entity')({ validator })

  const {
    commitUpdateNode,
    commitCreateNode,
    commitDeleteNodeById,
    getNodes,
  } = db

  return {
    /**
     * Create new node
     * @param {Object} data 
     * @returns {Object} created
     */
    createNoe: async function (data) {
      const node = makeCreate(data)
      const { type, parent: parentId } = node

      if (parentId) {
        const nodes = await getNodes({ _id: parentId })

        if (nodes.length !== 1) throw { name: 'invalidParent' }
        const parent = nodes[0]

        if (type === 'item' && parent.type === 'item') throw { name: 'invalidParent' }
        if (type === 'category' && parent.type === 'category') throw { name: 'invalidParent' }
      }

      const created = await commitCreateNode(node)

      return created
    },

    /**
     * Update  node
     * @param {Object} data 
     * @returns {Object} created
     */
    updateNode: async function (data) {
      const node = makeUpdate(data)
      const { _id, type, name, discount, parent: parentId, modifiedAt } = node

      const exists = await getNodes({ _id })
      if (!exists) throw { name: 'notFound' }

      if (parentId) {
        const nodes = await getNodes({ _id: parentId })

        if (nodes.length !== 1) throw { name: 'invalidParent' }
        const parent = nodes[0]

        if (type === 'item' && parent.type === 'item') throw { name: 'invalidParent' }
        if (type === 'category' && parent.type === 'category') throw { name: 'invalidParent' }
      }

      const updated = await commitUpdateNode(node._id, { type, name, discount, parent: parentId, modifiedAt })

      return updated
    },

    /**
     * Delete node
     * @param {Object} data 
     * @returns 
     */
    deleteNode: async function (data) {
      const node = makeDelete(data)

      const { _id } = node

      const [exists, children = []] = await Promise.all([
        getNodes({ _id }),
        getNodes({ parent: _id }),
      ])

      if (exists.length !== 1) throw { name: 'notFound' }
      if (children.length > 1) throw { name: 'deleteChildrenFirst' }

      const deleted = await commitDeleteNodeById(_id)

      return deleted
    },

    /**
     * Get nodes
     * @returns {Object []}
     */
    getNodes: async function (data) {
      const query = makeGet(data)
      const nodes = await getNodes(query)

      return nodes
    },
  }
}

module.exports = business