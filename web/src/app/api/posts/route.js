import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const posts = await sql`
      SELECT 
        p.id,
        p.content,
        p.created_at,
        p.likes_count,
        u.username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;

    return Response.json({ posts });
  } catch (error) {
    console.error("Error obteniendo posts:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { userId, content } = await request.json();

    if (!userId || !content) {
      return Response.json(
        { error: "UserId y content son requeridos" },
        { status: 400 },
      );
    }

    if (content.trim().length === 0) {
      return Response.json(
        { error: "El contenido no puede estar vacío" },
        { status: 400 },
      );
    }

    const newPost = await sql`
      INSERT INTO posts (user_id, content)
      VALUES (${userId}, ${content.trim()})
      RETURNING id, content, created_at, likes_count
    `;

    // Obtener el post completo con username
    const postWithUser = await sql`
      SELECT 
        p.id,
        p.content,
        p.created_at,
        p.likes_count,
        u.username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ${newPost[0].id}
    `;

    return Response.json({
      success: true,
      post: postWithUser[0],
    });
  } catch (error) {
    console.error("Error creando post:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
