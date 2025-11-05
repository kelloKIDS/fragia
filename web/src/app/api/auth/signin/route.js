import { verify } from "argon2";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: "Username y password son requeridos" },
        { status: 400 },
      );
    }

    // Buscar el usuario
    const user = await sql`
      SELECT id, username, password FROM users WHERE username = ${username}
    `;

    if (user.length === 0) {
      return Response.json(
        { error: "Username o password incorrectos" },
        { status: 401 },
      );
    }

    // Verificar la contraseña
    const isPasswordValid = await verify(user[0].password, password);

    if (!isPasswordValid) {
      return Response.json(
        { error: "Username o password incorrectos" },
        { status: 401 },
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user[0].id,
        username: user[0].username,
      },
    });
  } catch (error) {
    console.error("Error en signin:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
