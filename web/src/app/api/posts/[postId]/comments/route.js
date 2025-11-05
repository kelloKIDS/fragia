import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { postId } = params;

    const comments = await sql`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC
    `;

    return Response.json({ comments });
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { postId } = params;
    const { userId, content } = await request.json();

    if (!userId || !postId || !content) {
      return Response.json(
        { error: "UserId, postId y content son requeridos" },
        { status: 400 },
      );
    }

    if (content.trim().length === 0) {
      return Response.json(
        { error: "El comentario no puede estar vacío" },
        { status: 400 },
      );
    }

    const newComment = await sql`
      INSERT INTO comments (post_id, user_id, content)
      VALUES (${postId}, ${userId}, ${content.trim()})
      RETURNING id, content, created_at
    `;

    // Obtener el comentario completo con username
    const commentWithUser = await sql`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ${newComment[0].id}
    `;

    return Response.json({
      success: true,
      comment: commentWithUser[0],
    });
  } catch (error) {
    console.error("Error creando comentario:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
