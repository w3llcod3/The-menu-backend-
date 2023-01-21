function Model({ mongoose }) {
  const schema = mongoose.Schema(
    {
      name: { type: String, default: null },
      email: { type: String, default: null },
      password: { type: String, default: null },
      createdAt: { type: Date, default: null },
    }
  )

  schema.index({ createdAt: -1 })

  return {
    Account: mongoose.model('Account', schema)
  }
}

module.exports = Model