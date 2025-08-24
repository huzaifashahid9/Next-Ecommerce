import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpemail";
import { connectDb } from "@/lib/ConnectDb";
import { generateOtp, response } from "@/lib/Helper/responsehelper";
import { sendEmail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
  try {
    await connectDb();
    const payload = await request.json();
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success) {
      return response(false, 401, "Validation Error", validateData.error);
    }

    const { email, password } = validateData.data;

    const getUser = await UserModel.findOne({ email }).select("+password");

    if (!getUser) {
      return response(false, 400, "Invalid Login Credentials");
    }

    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendEmail(
        "Email Verification request from Team Huzaifa ",
        email,

        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );
      return response(
        false,
        401,
        "Your Email is not verified, We have sent you another verification email, Please verify your email to login"
      );
    }

    const isPasswordMatched = await getUser.comparePassword(password);

    if (!isPasswordMatched) {
      return response(false, 400, "Invalid Login Credentials");
    }

    await OtpModel.deleteMany({ email });

    const otp = generateOtp();

    const newOtpData = await OtpModel.create({ email, otp });

    const otpEmailStatus = await sendEmail(
      "Your login verification OTP from Team Huzaifa",
      email,
      otpEmail(otp)
    );

    console.log('otpEmailStatus',otpEmailStatus)

    if (!otpEmailStatus) {
      return response(false, 500, "Error sending OTP email, Please try again");
    }

    return response(
      true,
      200,
      "OTP has been sent to your email, Please verify to complete login",
      newOtpData
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return response(false, 500, "Internal server error", {
      error: error.message,
    });
  }
}
