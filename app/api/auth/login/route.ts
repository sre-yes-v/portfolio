import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      return Response.json({ success: true, token });
    }

    return Response.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}