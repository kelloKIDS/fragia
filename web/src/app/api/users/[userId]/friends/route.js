import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { userId } = params;

    const friends = await sql`
      SELECT 
        u.id,
        u.username,
        u.created_at,
        f.created_at as friendship_date
      FROM users u
      JOIN friendships f ON (
        (f.user1_id = ${userId} AND f.user2_id = u.id) OR
        (f.user2_id = ${userId} AND f.user1_id = u.id)
      )
      WHERE f.status = 'accepted' AND u.id != ${userId}
      ORDER BY f.created_at DESC
    `;

    return Response.json({ friends });
  } catch (error) {
    console.error("Error obteniendo amigos:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
