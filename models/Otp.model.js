import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 10 * 60 * 1000,
    }, // OTP valid for 10 minutes
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export default OtpModel;
