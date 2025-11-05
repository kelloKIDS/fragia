import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { postId } = params;
    const { userId } = await request.json();

    if (!userId || !postId) {
      return Response.json(
        { error: "UserId y postId son requeridos" },
        { status: 400 },
      );
    }

    // Verificar si ya le dio like
    const existingLike = await sql`
      SELECT id FROM likes WHERE post_id = ${postId} AND user_id = ${userId}
    `;

    if (existingLike.length > 0) {
      // Quitar like
      await sql`
        DELETE FROM likes WHERE post_id = ${postId} AND user_id = ${userId}
      `;

      await sql`
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = ${postId}
      `;

      return Response.json({
        success: true,
        liked: false,
      });
    } else {
      // Agregar like
      await sql`
        INSERT INTO likes (post_id, user_id) VALUES (${postId}, ${userId})
      `;

      await sql`
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${postId}
      `;

      return Response.json({
        success: true,
        liked: true,
      });
    }
  } catch (error) {
    console.error("Error con like:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
