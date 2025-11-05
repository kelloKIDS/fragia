import { hash } from "argon2";
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

    if (username.length < 3 || password.length < 6) {
      return Response.json(
        {
          error:
            "Username debe tener al menos 3 caracteres y password al menos 6",
        },
        { status: 400 },
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: "Este username ya está en uso" },
        { status: 400 },
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password);

    // Crear el usuario
    const newUser = await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
      RETURNING id, username, created_at
    `;

    return Response.json({
      success: true,
      user: newUser[0],
    });
  } catch (error) {
    console.error("Error en signup:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
