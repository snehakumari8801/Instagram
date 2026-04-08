
import { useRef, useEffect } from "react";
import { FaUserCircle, FaPaperclip, FaUser } from "react-icons/fa";

function ChatArea({ 
  currentChat, 
  messages, 
  setProfileView, 
  setCurrentChat,
  newMessage,
  setNewMessage,
  onSendMessage,
  loading,
  onUploadMedia,
  currentUserId // Add this prop to get the current user's actual ID
}) {
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(currentUserId,messages)
  return (
    <div className={`chat-area ${!currentChat ? "hidden-on-mobile" : ""}`}>
      {currentChat ? (
        <>
          {/* Chat Header */}
          <div className="chat-header">
            <button
              className="back-button mobile-only"
              onClick={() => setCurrentChat(null)}
            >
              ⬅
            </button>
            <div
              className="chat-user"
              onClick={() => setProfileView(currentChat)}
            >
              {currentChat.avatar ? (
                <img src={currentChat.avatar} alt={currentChat.name} />
              ) : (
                <FaUserCircle className="dummy-avatar" />
              )}
              <div>
                <h3>{currentChat.name}</h3>
                {currentChat.online && (
                  <span className="online-text">online</span>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map((message) => {
              // Check if message is from current user using actual ID
              // Use both 'sender' and 'senderId' for backward compatibility
              {/* const isMyMessage = message.senderId === currentUserId || message.sender === "me"; */}
              const isMyMessage = message.id === currentUserId || message.sender === "me";
               <div>isMyMessage</div>
              return (
                <div
                  key={message.id}
                  className={`message-row ${isMyMessage ? "sent" : "received"}`}
                >
                  {/* Show avatar only for received messages (from others) */}
                  {!isMyMessage && (
                    <div className="message-avatar">
                      {currentChat.avatar ? (
                        <img
                          src={currentChat.avatar}
                          className="profile-icon"
                          alt="profile"
                        />
                      ) : (
                        <FaUser className="profile-icon" />
                      )}
                    </div>
                  )}

                  <div className="message-bubble">
                    {/* Show media if available */}
                    {message.pic && (
                      <div className="media-container">
                        <img
                          src={message.pic}
                          className="message-media small"
                          alt="Media"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="media-placeholder">
                          <FaUserCircle size={24} />
                          <span>Media not available</span>
                        </div>
                      </div>
                    )}
                    {message.video && (
                      <div className="media-container">
                        <video
                          src={message.video}
                          className="message-media small"
                          controls
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="media-placeholder">
                          <FaUserCircle size={24} />
                          <span>Media not available</span>
                        </div>
                      </div>
                    )}
                    {message.text && <p>{message.text}</p>}
                    <span className="message-time">{message.time}</span>
                  </div>

                  {/* Add spacer for sent messages to balance layout */}
                  {isMyMessage && <div className="avatar-spacer"></div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="message-input">
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              <FaPaperclip size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*,video/*"
              onChange={onUploadMedia}
            />
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
              disabled={loading}
            />
            <button onClick={onSendMessage} disabled={loading || !newMessage.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">
          <h3>Your Messages</h3>
          <p>Send private photos and messages to a friend</p>
          <button className="start-chat-button">Send Message</button>
        </div>
      )}

      <style jsx>{`
        .chat-area {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
        }
        .chat-header {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .chat-user {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .chat-user img,
        .dummy-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          color: #ccc;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .message-row {
          display: flex;
          align-items: flex-end;
        }
        .message-row.sent {
          justify-content: flex-end;
        }
        .message-row.received {
          justify-content: flex-start;
        }
        .message-avatar {
          margin-right: 8px;
          display: flex;
          align-items: flex-end;
        }
        .message-bubble {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 18px;
          position: relative;
          font-size: 14px;
        }
        .sent .message-bubble {
          background: #0095f6;
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .received .message-bubble {
          background: #efefef;
          color: #000;
          border-bottom-left-radius: 4px;
        }
        .profile-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #bbb;
          background: #f0f0f0;
          padding: 5px;
        }
        .avatar-spacer {
          width: 32px;
          visibility: hidden;
        }
        .message-time {
          font-size: 11px;
          opacity: 0.7;
          display: block;
          margin-top: 4px;
        }
        .sent .message-time {
          color: rgba(255, 255, 255, 0.8);
          text-align: right;
        }
        .received .message-time {
          color: rgba(0, 0, 0, 0.6);
          text-align: left;
        }
        .media-container {
          position: relative;
          margin-bottom: 5px;
        }
        .message-media.small {
          max-width: 250px;
          max-height: 200px;
          border-radius: 12px;
        }
        .media-placeholder {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 150px;
          background: #f0f0f0;
          border-radius: 12px;
          color: #999;
          font-size: 12px;
          gap: 8px;
        }
        .message-input {
          display: flex;
          align-items: center;
          padding: 10px;
          border-top: 1px solid #eee;
          gap: 8px;
        }
        .message-input input[type="text"] {
          flex: 1;
          padding: 10px;
          border-radius: 20px;
          border: 1px solid #ddd;
          outline: none;
          font-size: 14px;
        }
        .message-input button {
          background: none;
          border: none;
          cursor: pointer;
        }
        .upload-btn {
          color: #555;
        }
        @media (max-width: 600px) {
          .message-bubble {
            max-width: 80%;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatArea;






















