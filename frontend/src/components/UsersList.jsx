
import React from "react";

function UsersList({ users, currentChat, setCurrentChat, setProfileView }) {
  return (
    <div className="users-list overflow-y-auto h-full bg-white">
      {users.map((user) => {
        const active = currentChat?.id === user.id;
        return (
          <div
            key={user.id}
            className={`user-item flex items-center p-2 cursor-pointer ${active ? "bg-blue-100" : ""}`}
            onClick={() => setCurrentChat(user)}
          >
            <div className="user-avatar mr-2 relative" onClick={(e) => { e.stopPropagation(); setProfileView(user); }}>
              <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
              {user.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{user.name}</h3>
              <p className="text-xs text-gray-500 truncate">{user.lastMessage}</p>
            </div>
            <span className="text-xs text-gray-400">{user.time}</span>
          </div>
        );
      })}
    </div>
  );
}

export default UsersList;
