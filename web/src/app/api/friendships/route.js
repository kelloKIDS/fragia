import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { userId1, userId2, action } = await request.json();

    if (!userId1 || !userId2) {
      return Response.json(
        { error: "UserId1 y userId2 son requeridos" },
        { status: 400 },
      );
    }

    if (userId1 === userId2) {
      return Response.json(
        { error: "No puedes agregarte a ti mismo" },
        { status: 400 },
      );
    }

    if (action === "send") {
      // Enviar solicitud de amistad
      const existingFriendship = await sql`
        SELECT * FROM friendships 
        WHERE (user1_id = ${userId1} AND user2_id = ${userId2}) 
           OR (user1_id = ${userId2} AND user2_id = ${userId1})
      `;

      if (existingFriendship.length > 0) {
        return Response.json(
          { error: "Ya existe una solicitud de amistad" },
          { status: 400 },
        );
      }

      await sql`
        INSERT INTO friendships (user1_id, user2_id, status)
        VALUES (${userId1}, ${userId2}, 'pending')
      `;

      return Response.json({
        success: true,
        message: "Solicitud de amistad enviada",
      });
    } else if (action === "accept") {
      // Aceptar solicitud de amistad
      await sql`
        UPDATE friendships 
        SET status = 'accepted'
        WHERE (user1_id = ${userId2} AND user2_id = ${userId1} AND status = 'pending')
      `;

      return Response.json({
        success: true,
        message: "Solicitud de amistad aceptada",
      });
    } else if (action === "reject" || action === "remove") {
      // Rechazar/eliminar solicitud de amistad
      await sql`
        DELETE FROM friendships 
        WHERE (user1_id = ${userId1} AND user2_id = ${userId2}) 
           OR (user1_id = ${userId2} AND user2_id = ${userId1})
      `;

      return Response.json({
        success: true,
        message:
          action === "reject" ? "Solicitud rechazada" : "Amistad eliminada",
      });
    }

    return Response.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error gestionando amistad:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
