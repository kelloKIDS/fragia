import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const currentUserId = searchParams.get("userId");

    if (!query || !currentUserId) {
      return Response.json({ users: [] });
    }

    const users = await sql`
      SELECT 
        u.id,
        u.username,
        u.created_at,
        CASE 
          WHEN f1.status = 'accepted' THEN 'friends'
          WHEN f1.status = 'pending' AND f1.user1_id = ${currentUserId} THEN 'sent'
          WHEN f1.status = 'pending' AND f1.user2_id = ${currentUserId} THEN 'received'
          ELSE 'none'
        END as friendship_status
      FROM users u
      LEFT JOIN friendships f1 ON 
        (f1.user1_id = ${currentUserId} AND f1.user2_id = u.id) OR
        (f1.user2_id = ${currentUserId} AND f1.user1_id = u.id)
      WHERE u.username ILIKE ${`%${query}%`} AND u.id != ${currentUserId}
      ORDER BY u.username
      LIMIT 20
    `;

    return Response.json({ users });
  } catch (error) {
    console.error("Error buscando usuarios:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
