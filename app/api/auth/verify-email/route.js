import { connectDb } from "@/lib/ConnectDb";
import { response } from "@/lib/Helper/responsehelper";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDb();
    const { token } = await request.json();
    if (!token) {
      return response(false, 400, "Token is required");
    }
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);

    const userid = decoded.payload.userId;

    const user = await UserModel.findById(userid);
    if (!user) {
      return response(false, 404, "User not found");
    }
    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Email verified successfully", user);
  } catch (error) {
    console.error("Error in email verification:", error);
    return response(false, 500, "Internal server error", {
      error: error.message,
    });
  }
}
