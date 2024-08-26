import mongoose from 'mongoose'

export const URLSchema = new mongoose.Schema(
  {
    shortURL: {
      type: String,
      required: true,
      unique: true,
    },
    redirectedURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)
