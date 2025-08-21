import { connectDb } from "@/lib/ConnectDb";
import { response } from "@/lib/Helper/responsehelper";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

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

    return response(true, 201, "User created successfully", newUser);
  } catch (error) {
    console.error("Error in signup route:", error);
    return response(false, 500, "Internal server error", {
      error: error.message,
    });
  }
}
