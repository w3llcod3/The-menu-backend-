function Model({ mongoose }) {
  const schema = mongoose.Schema(
    {
      type: { type: String, default: null },
      name: { type: String, default: null },
      discount: { type: String, default: 0 },
      parent: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuNode', default: null },
      createdAt: { type: Date, default: null },
      modifiedAt: { type: Date, default: null },
    }
  )

  schema.index({ createdAt: -1 })

  return {
    MenuNode: mongoose.model('MenuNode', schema)
  }
}

module.exports = Model