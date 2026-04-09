import jwt from "jsonwebtoken";

export async function POST(req: Request) {
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

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; HttpOnly`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  return Response.json({ success: false });
}