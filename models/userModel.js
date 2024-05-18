import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/339/149/png-transparent-incognito-hd-logo-thumbnail.png",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
