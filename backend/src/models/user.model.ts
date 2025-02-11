import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  failedLoginAttempts: number;
  isLocked: boolean;
  incrementFailedLoginAttempts(): Promise<UserDocument>;
  resetFailedLoginAttempts(): Promise<UserDocument>;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "name" | "email" | "verified" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    failedLoginAttempts: { type: Number, default: 0 as number },
    isLocked: { type: Boolean, default: false as boolean }
  },
  {
    timestamps: true,
  }
);


userSchema.methods.resetFailedLoginAttempts = function() {
  this.failedLoginAttempts = 0 as number;
  this.isLocked = false as boolean;
  return this.save();
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  return next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.incrementFailedLoginAttempts = function() {
  this.failedLoginAttempts = (this.failedLoginAttempts as number) + 1;
  if ((this.failedLoginAttempts as number) >= 5) {
      this.isLocked = true as boolean;
  }
  return this.save();
};

userSchema.methods.resetFailedLoginAttempts = function() {
  this.failedLoginAttempts = 0 as number;
  this.isLocked = false as boolean;
  return this.save();
};



const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
