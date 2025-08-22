import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDb } from "@/lib/ConnectDb";
import { response } from "@/lib/Helper/responsehelper";
import { sendEmail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDb();

    const validationSchema = zSchema.pick({
      email: true,
      password: true,
      name: true,
    });

    const payloadData = await request.json();
    const parsedData = validationSchema.safeParse(payloadData);

    if (!parsedData.success) {
      return response(
        false,
        400,
        "Validation Error",
        parsedData.error.format()
      );
    }

    const { email, password, name } = parsedData.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response(false, 400, "User already exists with this email");
    }

    const newUser = await UserModel.create({ email, password, name });

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    await sendEmail(
      "Email Verification request from Team Huzaifa ",
      email,
      // emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`, name)
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    return response(
      true,
      201,
      "Registration Succes,Please Verify Your Email Address",
      newUser
    );
  } catch (error) {
    console.error("Error in signup route:", error);
    return response(false, 500, "Internal server error", {
      error: error.message,
    });
  }
}
