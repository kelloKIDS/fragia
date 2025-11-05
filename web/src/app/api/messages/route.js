import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const chatWithUserId = searchParams.get("chatWithUserId");

    if (!userId || !chatWithUserId) {
      return Response.json(
        { error: "UserId y chatWithUserId son requeridos" },
        { status: 400 },
      );
    }

    const messages = await sql`
      SELECT 
        m.id,
        m.content,
        m.created_at,
        m.sender_id,
        u.username as sender_username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ${userId} AND m.receiver_id = ${chatWithUserId})
         OR (m.sender_id = ${chatWithUserId} AND m.receiver_id = ${userId})
      ORDER BY m.created_at ASC
    `;

    return Response.json({ messages });
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { senderId, receiverId, content } = await request.json();

    if (!senderId || !receiverId || !content) {
      return Response.json(
        { error: "SenderId, receiverId y content son requeridos" },
        { status: 400 },
      );
    }

    if (content.trim().length === 0) {
      return Response.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 },
      );
    }

    // Verificar que son amigos
    const friendship = await sql`
      SELECT * FROM friendships 
      WHERE ((user1_id = ${senderId} AND user2_id = ${receiverId}) 
          OR (user1_id = ${receiverId} AND user2_id = ${senderId}))
        AND status = 'accepted'
    `;

    if (friendship.length === 0) {
      return Response.json(
        { error: "Solo puedes enviar mensajes a tus amigos" },
        { status: 403 },
      );
    }

    const newMessage = await sql`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES (${senderId}, ${receiverId}, ${content.trim()})
      RETURNING id, content, created_at, sender_id
    `;

    // Obtener el mensaje completo con username
    const messageWithUser = await sql`
      SELECT 
        m.id,
        m.content,
        m.created_at,
        m.sender_id,
        u.username as sender_username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ${newMessage[0].id}
    `;

    return Response.json({
      success: true,
      message: messageWithUser[0],
    });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
