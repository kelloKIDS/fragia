"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("feed");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLoginMode ? "/api/auth/signin" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setCurrentUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setFormData({ username: "", password: "" });
    } catch (error) {
      console.error("Error en autenticación:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveSection("feed");
  };

  // Si no hay usuario logueado, mostrar login/registro
  if (!currentUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #ADD8E6, #90EE90, #DDA0DD)",
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://ucarecdn.com/318f2a51-a342-4448-8946-c0e57b91358d/-/format/auto/"
              alt="Fragia Logo"
              className="w-20 h-20 mx-auto mb-4 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Bienvenido a Fragia!
            </h1>
            <p className="text-gray-600">
              {isLoginMode
                ? "Inicia sesión para conectar"
                : "Crea tu cuenta y conecta"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ADD8E6] text-gray-800 font-semibold rounded-lg hover:bg-[#90EE90] transition duration-300 disabled:opacity-50"
            >
              {loading
                ? "Procesando..."
                : isLoginMode
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
                setFormData({ username: "", password: "" });
              }}
              className="text-[#DDA0DD] hover:underline"
            >
              {isLoginMode
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario está logueado, mostrar la red social
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #ADD8E6, #90EE90, #DDA0DD)",
      }}
    >
      {/* Header */}
      <div className="bg-[#ADD8E6] text-gray-800 px-4 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="https://ucarecdn.com/318f2a51-a342-4448-8946-c0e57b91358d/-/format/auto/"
              alt="Fragia Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold">Fragia Social</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              Hola, {currentUser.username}!
            </span>
            <button
              onClick={handleLogout}
              className="bg-[#DDA0DD] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#DDA0DD] shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around py-3">
            {[
              { key: "feed", label: "🏠 Feed", icon: "🏠" },
              { key: "friends", label: "👥 Amigos", icon: "👥" },
              { key: "chats", label: "💬 Chats", icon: "💬" },
              { key: "search", label: "🔍 Buscar", icon: "🔍" },
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-4 py-2 rounded-lg transition text-sm md:text-base ${
                  activeSection === section.key
                    ? "bg-[#90EE90] text-gray-800"
                    : "text-gray-700 hover:bg-[#90EE90] hover:text-gray-800"
                }`}
              >
                <span className="md:hidden">{section.icon}</span>
                <span className="hidden md:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {activeSection === "feed" && <FeedSection currentUser={currentUser} />}
        {activeSection === "friends" && (
          <FriendsSection currentUser={currentUser} />
        )}
        {activeSection === "chats" && (
          <ChatsSection currentUser={currentUser} />
        )}
        {activeSection === "search" && (
          <SearchSection currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}

// Componente Feed
function FeedSection({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error cargando posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content: newPost.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost("");
      }
    } catch (error) {
      console.error("Error creando post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        // Recargar posts para actualizar likes
        loadPosts();
      }
    } catch (error) {
      console.error("Error con like:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando feed...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Crear nuevo post */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          ¿Qué estás pensando, {currentUser.username}?
        </h3>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Comparte algo con tus amigos..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={!newPost.trim()}
            className="bg-[#ADD8E6] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#90EE90] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </form>
      </div>

      {/* Lista de posts */}
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No hay publicaciones aún. ¡Sé el primero en compartir algo!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de tarjeta de post
function PostCard({ post, currentUser, onLike }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const loadComments = async () => {
    if (!showComments) {
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments);
        }
      } catch (error) {
        console.error("Error cargando comentarios:", error);
      }
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error creando comentario:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#ADD8E6] rounded-full flex items-center justify-center text-lg">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-gray-800">{post.username}</div>
          <div className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{post.content}</p>

      <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          ❤️ {post.likes_count} Me gusta
        </button>
        <button
          onClick={loadComments}
          className="flex items-center gap-1 hover:text-blue-500 transition"
        >
          💬 Comentar
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-[#DDA0DD] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 rounded-lg p-3">
                <div className="font-medium text-sm text-gray-800">
                  {comment.username}
                </div>
                <div className="text-gray-700">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Amigos
function FriendsSection({ currentUser }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, [currentUser]);

  const loadFriends = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}/friends`);
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
      }
    } catch (error) {
      console.error("Error cargando amigos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando amigos...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Mis Amigos</h2>

      {friends.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aún no tienes amigos
          </h3>
          <p className="text-gray-500">
            ¡Ve a la sección de buscar para encontrar y agregar amigos!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 bg-[#ADD8E6] rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-800">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {friend.username}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Amigos desde{" "}
                {new Date(friend.friendship_date).toLocaleDateString()}
              </p>
              <button className="bg-[#90EE90] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#DDA0DD] hover:text-white transition">
                Enviar Mensaje
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente Chats con personajes simulados
function ChatsSection({ currentUser }) {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});

  const characters = [
    {
      id: "sofia",
      name: "Sofia",
      image:
        "https://ucarecdn.com/6cdd2997-13fe-42e1-b2bf-8e03a59f0fc7/-/format/auto/",
      personality: "amigable y creativa",
      responses: [
        "¡Hola! ¿Cómo estás hoy? 😊",
        "Me encanta hacer nuevos amigos, cuéntame sobre ti",
        "¡Qué interesante! A mí también me gusta eso",
        "Siempre trato de ver el lado positivo de las cosas ✨",
        "¿Te gustaría que hiciéramos algo juntos?",
      ],
    },
    {
      id: "mateo",
      name: "Mateo",
      image:
        "https://ucarecdn.com/336aa6a5-9477-42d0-a18a-21df373e8f87/-/format/auto/",
      personality: "deportista y motivador",
      responses: [
        "¡Oye! ¿Cómo va todo? 💪",
        "¿Practicas algún deporte? A mí me encanta el fútbol",
        "¡Genial! Siempre es bueno mantenerse activo",
        "La clave está en nunca rendirse, ¡tú puedes! ⚽",
        "¿Quieres que vayamos a jugar algo después?",
      ],
    },
    {
      id: "leonardo",
      name: "Leonardo",
      image:
        "https://ucarecdn.com/9ae865bd-53d6-49df-b9c4-a3277bfb2e8a/-/format/auto/",
      personality: "intelectual y curioso",
      responses: [
        "Saludos, ¿cómo te encuentras? 📚",
        "Me fascina aprender cosas nuevas cada día",
        "Esa es una perspectiva muy interesante",
        "¿Sabías que... bueno, mejor cuéntame tú algo!",
        "Creo que podríamos tener conversaciones muy enriquecedoras",
      ],
    },
    {
      id: "emma",
      name: "Emma",
      image:
        "https://ucarecdn.com/29e22d3c-5c22-4a17-84b2-124cd497ccad/-/format/auto/",
      personality: "artística y empática",
      responses: [
        "Hola querido/a, ¿cómo te sientes hoy? 🎨",
        "Me encanta expresarme a través del arte",
        "Entiendo perfectamente lo que sientes",
        "Todos tenemos días buenos y malos, y eso está bien",
        "¿Te gustaría que creáramos algo juntos?",
      ],
    },
  ];

  const sendMessage = (characterId, userMessage) => {
    const character = characters.find((c) => c.id === characterId);
    const chatMessages = messages[characterId] || [];

    // Agregar mensaje del usuario
    const newMessages = [
      ...chatMessages,
      { sender: "user", content: userMessage, timestamp: new Date() },
    ];

    // Simular respuesta del personaje después de un breve delay
    setTimeout(() => {
      const randomResponse =
        character.responses[
          Math.floor(Math.random() * character.responses.length)
        ];
      const updatedMessages = [
        ...newMessages,
        {
          sender: character.id,
          content: randomResponse,
          timestamp: new Date(),
        },
      ];

      setMessages((prev) => ({
        ...prev,
        [characterId]: updatedMessages,
      }));
    }, 500);

    setMessages((prev) => ({
      ...prev,
      [characterId]: newMessages,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Chats Amigables</h2>

      {!activeChat ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => setActiveChat(character)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {character.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Es {character.personality}
                  </p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    En línea
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ChatWindow
          character={activeChat}
          messages={messages[activeChat.id] || []}
          onSendMessage={(message) => sendMessage(activeChat.id, message)}
          onBack={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}

// Componente de ventana de chat
function ChatWindow({ character, messages, onSendMessage, onBack }) {
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(inputMessage.trim());
    setInputMessage("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg h-[500px] flex flex-col">
      {/* Header del chat */}
      <div className="flex items-center gap-4 p-4 border-b bg-[#ADD8E6] rounded-t-2xl">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          ← Volver
        </button>
        <img
          src={character.image}
          alt={character.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{character.name}</h3>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            En línea
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            ¡Di hola para comenzar la conversación! 👋
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-[#90EE90] text-gray-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input de mensaje */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Escribe a ${character.name}...`}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-[#DDA0DD] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente Buscar
function SearchSection({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery.trim())}&userId=${currentUser.id}`,
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error("Error buscando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendshipAction = async (userId, action) => {
    try {
      const response = await fetch("/api/friendships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId1: currentUser.id,
          userId2: userId,
          action,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        // Actualizar los resultados de búsqueda
        handleSearch({ preventDefault: () => {} });

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error con amistad:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Buscar Amigos</h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por nombre de usuario..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-[#ADD8E6] text-gray-800 px-6 py-3 rounded-lg hover:bg-[#90EE90] transition disabled:opacity-50"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg">
            {message}
          </div>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Resultados de búsqueda:
          </h3>
          {searchResults.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ADD8E6] rounded-full flex items-center justify-center text-lg font-bold text-gray-800">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {user.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Miembro desde{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  {user.friendship_status === "none" && (
                    <button
                      onClick={() => handleFriendshipAction(user.id, "send")}
                      className="bg-[#90EE90] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#ADD8E6] transition"
                    >
                      Agregar Amigo
                    </button>
                  )}
                  {user.friendship_status === "sent" && (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      Solicitud Enviada
                    </button>
                  )}
                  {user.friendship_status === "received" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleFriendshipAction(user.id, "accept")
                        }
                        className="bg-[#90EE90] text-gray-800 px-3 py-2 rounded-lg hover:bg-[#ADD8E6] transition text-sm"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() =>
                          handleFriendshipAction(user.id, "reject")
                        }
                        className="bg-red-400 text-white px-3 py-2 rounded-lg hover:bg-red-500 transition text-sm"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                  {user.friendship_status === "friends" && (
                    <button
                      disabled
                      className="bg-[#DDA0DD] text-white px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      Ya son Amigos
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-600">
          No se encontraron usuarios con ese nombre.
        </div>
      )}
    </div>
  );
}
