

// ChatApp.jsx - Single page with both user list and chat
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
import AppHeader from "./AppHeader";
import UsersList from "./UsersList";
import ChatArea from "./ChatArea";
import ProfileView from "./ProfileView";
import BottomNav from "./BottomNav";
import api from "../utils/api";
//  import {useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { withCredentials: true });

function ChatApp() {
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [profileView, setProfileView] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUserId, setChatUserId] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState({
    users: false,
    messages: false,
    sending: false,
  });
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // On desktop, always show both panels if a chat is selected
      if (!mobile && currentChat) {
        setShowChat(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [currentChat]);

  // Load current user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setChatUser(parsed);
        setChatUserId(parsed._id);
      } catch (error) {
        console.error("User parse error:", error);
      }
    }
  }, []);

  // Fetch users for sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading((p) => ({ ...p, users: true }));
        const response = await api.get("/message/getAllUserForSidebar");

        if (response.data?.data) {
          const formatted = response.data.data.map((u) => ({
            id: u._id,
            username: u.email.split("@")[0],
            name: u.name,
            avatar:
              u.profilePic || "https://randomuser.me/api/portraits/men/1.jpg",
            lastMessage: "",
            time: "",
            online: false,
          }));
          setUsers(formatted);
        }
      } catch (error) {
        setError(error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading((p) => ({ ...p, users: false }));
      }
    };
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (!chatUserId) return;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    // Initialize socket
    const newSocket = io("http://localhost:8000", { withCredentials: true });
    setSocket(newSocket);

    // Register user on socket
    newSocket.emit("register", loggedInUser._id);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [chatUserId]);

  useEffect(() => {
    if (!socket || !chatUserId || !currentChat?.id) return;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    // Request all messages for selected chat
    socket.emit("get_all_messages", {
      myId: loggedInUser._id,
      chatUserId: currentChat.id,
    });

    // Listen for messages from backend
    const handleAllMessages = (msgs) => {
      const formatted = msgs.map((m) => ({
        id: m._id,
        sender: m.senderId === loggedInUser._id ? "me" : "other",
        senderId: m.senderId,
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        pic: m.pic,
        video: m.video,
      }));
      setMessages(formatted);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleReceiveMessage = (msg) => {
      // Add only messages for this chat
      if (
        msg.senderId === currentChat.id ||
        msg.receiverId === currentChat.id
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            sender: msg.senderId === loggedInUser._id ? "me" : "other",
            senderId: msg.senderId,
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            pic: msg.pic,
            video: msg.video,
          },
        ]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("all_messages", handleAllMessages);
    socket.on("receive_message", handleReceiveMessage);

    // Cleanup listeners when chat changes
    return () => {
      socket.off("all_messages", handleAllMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, currentChat, chatUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat?.id) return;

    const msgData = {
      senderId: chatUserId, // your user id
      receiverId: currentChat.id, // chat partner id
      text: newMessage,
      pic: null, // optional
      video: null, // optional
      createdAt: new Date(),
    };

    // Emit message via socket
    socket.emit("send_message", msgData);

    // Optionally, update your local messages immediately for instant UI feedback
    setMessages((prev) => [
      ...prev,
      {
        ...msgData,
        id: Math.random().toString(36).substring(2, 9), // temporary id until DB returns real id
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setNewMessage("");

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setCurrentChat(user);
    setNewMessage("");
    if (isMobile) {
      setShowChat(true);
    }
  };

  // Handle back to user list on mobile
  const handleBackToUsers = () => {
    if (isMobile) {
      setShowChat(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "chat") {
      setCurrentChat(null);
      if (isMobile) {
        setShowChat(false);
      }
    }
  };

  const filteredUsers =
    users?.filter(
      (u) =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // const handleLogout = async () => {
  //   await api.post("/user/logout");
  //   localStorage.clear();
  //   navigate("/login");
  // };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setMessages([]);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    navigate("/login");
  };

  if (loading.users)
    return <div className="loading-screen">Loading users...</div>;
  if (error) return <div className="error-screen">Error: {error}</div>;

  return (
    <div className="instagram-app">
      {/* Header - Always visible */}
      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
        isMobile={isMobile}
      />

      <main className="instagram-main">
        {activeTab === "chat" && (
          <div className="chat-page">
            {/* User List - Always in DOM, visibility controlled by CSS */}
            <div
              className={`user-list-container ${showChat ? "mobile-hidden" : ""}`}
            >
              <div className="user-list-header">
                <h2>Messages</h2>
                <div className="new-chat-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5V19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="users-list">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`user-item ${currentChat?.id === user.id ? "active" : ""}`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="user-avatar">
                      <img src={user.avatar} alt={user.name} />
                      {user.online && <span className="online-dot"></span>}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-last-msg">
                        {user.lastMessage || "No messages yet"}
                      </div>
                    </div>
                    {user.time && (
                      <div className="message-time">{user.time}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area - Always in DOM, visibility controlled by CSS */}
            <div
              className={`chat-area-container ${showChat ? "mobile-visible" : ""}`}
            >
              {currentChat ? (
                <>
                  {/* Chat Header with Back Button on Mobile */}
                  <div className="chat-header">
                    {isMobile && (
                      <button
                        className="back-btn"
                        onClick={handleBackToUsers}
                        aria-label="Back to messages"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M15 18L9 12L15 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                    <div
                      className="chat-user-info"
                      onClick={() => setProfileView(currentChat)}
                    >
                      <img src={currentChat.avatar} alt={currentChat.name} />
                      <div>
                        <h3>{currentChat.name}</h3>
                        <span className="user-status">
                          {currentChat.online ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                    <div className="chat-actions">
                      <button className="action-btn">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22 16.92C22 18.07 21.07 19 19.92 19C19.82 19 19.73 19 19.63 18.95C16.93 18.3 14.6 16.68 12.56 14.64C10.52 12.6 8.9 10.27 8.25 7.57C8.2 7.37 8.2 7.28 8.2 7.18C8.2 6.03 9.13 5.1 10.28 5.1C10.38 5.1 10.48 5.1 10.58 5.15C11.13 5.3 11.6 5.63 11.9 6.08C12.02 6.27 12.09 6.48 12.1 6.7C12.1 6.9 12.05 7.08 11.96 7.24C11.78 7.56 11.62 7.89 11.5 8.23C11.25 8.93 11.15 9.68 11.22 10.42C11.29 11.16 11.54 11.87 11.94 12.48C12.34 13.09 12.89 13.59 13.55 13.94C14.21 14.29 14.96 14.48 15.72 14.48C16.49 14.48 17.24 14.29 17.9 13.94C18.24 13.77 18.57 13.61 18.89 13.43C19.05 13.34 19.23 13.29 19.43 13.29C19.65 13.3 19.86 13.37 20.05 13.49C20.5 13.79 20.83 14.26 20.98 14.81C21.03 15.01 21.03 15.11 21.03 15.21C21.03 16.36 20.1 17.29 18.95 17.29C18.85 17.29 18.75 17.29 18.65 17.24C18.45 17.19 18.25 17.12 18.06 17.02C17.45 16.71 16.91 16.28 16.48 15.75C16.05 15.22 15.73 14.61 15.54 13.95"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button className="action-btn">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M23 7L16 12L23 17V7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="messages-container">
                    {loading.messages ? (
                      <div className="loading-messages">
                        <div className="spinner"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="no-messages">
                        <p>Start a conversation with {currentChat.name}</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`message ${message.sender === "me" ? "sent" : "received"}`}
                          >
                            <div className="message-content">
                              {message.text && <p>{message.text}</p>}
                              {message.pic && (
                                <img
                                  src={message.pic}
                                  alt="Attachment"
                                  className="message-image"
                                />
                              )}
                              <span className="message-time">
                                {message.time}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="message-input-area">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Type a message..."
                        className="message-input"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || loading.sending}
                        className="send-btn"
                      >
                        {loading.sending ? (
                          <div className="send-spinner"></div>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M22 2L11 13"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 2L15 22L11 13L2 9L22 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-chat-selected">
                  <div className="empty-chat">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                        stroke="#ddd"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3>Select a conversation</h3>
                    <p>
                      Choose from your existing conversations or start a new one
                    </p>
                    <button
                      className="start-chat-btn"
                      onClick={() => {
                        /* Open new chat modal */
                      }}
                    >
                      Start New Chat
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Overlay */}
            {isMobile && showChat && (
              <div className="mobile-overlay" onClick={handleBackToUsers} />
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileView
            profile={
              profileView || {
                id: "me",
                username: "myprofile",
                name: "My Profile",
                avatar: "https://randomuser.me/api/portraits/men/3.jpg",
              }
            }
            isMobile={isMobile}
          />
        )}
      </main>

      {/* Bottom Navigation - Hidden when chat is open on mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        setProfileView={setProfileView}
        isMobile={isMobile}
        showChat={showChat}
      />

      {/* Styles */}
      <style jsx>{`
        .instagram-app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fff;
        }

        .instagram-main {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .chat-page {
          display: flex;
          height: 100%;
          position: relative;
        }

        /* User List Styles */
        .user-list-container {
          width: 350px;
          border-right: 1px solid #eee;
          background: #fff;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-list-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-list-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #262626;
        }

        .new-chat-btn {
          background: #0095f6;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }

        .new-chat-btn:hover {
          background: #0081d6;
        }

        .users-list {
          flex: 1;
          overflow-y: auto;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f5f5f5;
        }

        .user-item:hover {
          background: #fafafa;
        }

        .user-item.active {
          background: #f0f8ff;
        }

        .user-avatar {
          position: relative;
          margin-right: 12px;
        }

        .user-avatar img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #4caf50;
          border: 2px solid white;
          border-radius: 50%;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          color: #262626;
          margin-bottom: 4px;
        }

        .user-last-msg {
          font-size: 14px;
          color: #8e8e8e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .message-time {
          font-size: 12px;
          color: #8e8e8e;
        }

        /* Chat Area Styles */
        .chat-area-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fafafa;
          height: 100%;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-header {
          background: #fff;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 72px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .back-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #262626;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .back-btn:hover {
          background: #f5f5f5;
        }

        .chat-user-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .chat-user-info img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .chat-user-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }

        .user-status {
          font-size: 13px;
          color: #8e8e8e;
        }

        .chat-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #262626;
          border-radius: 50%;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: #f5f5f5;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fafafa;
        }

        .loading-messages {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0095f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .no-messages {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #8e8e8e;
        }

        .message {
          max-width: 70%;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.sent {
          align-self: flex-end;
        }

        .message.received {
          align-self: flex-start;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 20px;
          position: relative;
        }

        .sent .message-content {
          background: #0095f6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .received .message-content {
          background: #fff;
          color: #262626;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-content p {
          margin: 0 0 6px 0;
          word-wrap: break-word;
        }

        .message-image {
          max-width: 200px;
          border-radius: 12px;
          margin-bottom: 6px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.8;
          text-align: right;
          display: block;
        }

        .no-chat-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #fafafa;
        }

        .empty-chat {
          text-align: center;
          color: #8e8e8e;
          max-width: 300px;
        }

        .empty-chat h3 {
          margin: 20px 0 10px;
          color: #262626;
        }

        .empty-chat p {
          margin-bottom: 20px;
          font-size: 14px;
        }

        .start-chat-btn {
          background: #0095f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .start-chat-btn:hover {
          background: #0081d6;
        }

        .message-input-area {
          padding: 20px;
          background: #fff;
          border-top: 1px solid #eee;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f5f5f5;
          border-radius: 24px;
          padding: 4px 4px 4px 20px;
        }

        .message-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 15px;
          padding: 12px 0;
          color: #262626;
        }

        .message-input::placeholder {
          color: #8e8e8e;
        }

        .send-btn {
          background: #0095f6;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          background: #0081d6;
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .send-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        .mobile-overlay {
          display: none;
        }

        /* Desktop Layout (both visible) */
        @media (min-width: 769px) {
          .user-list-container,
          .chat-area-container {
            position: static;
            transform: none !important;
            display: flex !important;
          }

          .back-btn {
            display: none;
          }

          .no-chat-selected {
            display: flex;
          }
        }

        /* Mobile Layout (slide between) */
        @media (max-width: 768px) {
          .user-list-container {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 10;
          }

          .chat-area-container {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 20;
            transform: translateX(100%);
          }

          .chat-area-container.mobile-visible {
            transform: translateX(0);
          }

          .user-list-container.mobile-hidden {
            transform: translateX(-100%);
          }

          .mobile-overlay {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 15;
          }

          .user-list-header {
            padding: 16px;
          }

          .user-item {
            padding: 12px 16px;
          }

          .chat-header {
            padding: 12px 16px;
          }

          .messages-container {
            padding: 16px;
          }

          .message-input-area {
            padding: 16px;
          }
        }

        /* Tablet Adjustments */
        @media (min-width: 769px) and (max-width: 1024px) {
          .user-list-container {
            width: 300px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatApp;
