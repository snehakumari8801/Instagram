const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // Reference to the user who created the post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Must match your User model name
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    video: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      trim: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Post", postSchema);
