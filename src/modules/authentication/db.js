function db({ Account }) {
  return {
    /**
     * Get account
     * @param {String} query 
     * @returns {Object}
     */
    findAccount: async function (query, ...args) {
      if (Object.keys(args).length) throw { name: 'invalidArgs' }

      const account = await Account.findOne(query)
        .lean()

      return account
    },
  }
}

module.exports = db