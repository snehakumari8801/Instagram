
import { useState, useEffect } from "react";
import api from "../utils/api";
import Posts from "./Posts";
import { Link } from "react-router-dom";

function PeopleStory({ setProfileView }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/message/getAllUserForSidebar");
        if (response.data?.data && Array.isArray(response.data.data)) {
          const formattedUsers = response.data.data.map((user) => ({
            id: user._id,
            username: user.email.split("@")[0],
            name: user.name,
            avatar:
              user.profilePic ||
              "https://randomuser.me/api/portraits/men/1.jpg",
            lastMessage: "",
            time: "",
            online: false,
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <div className="relative flex flex-col h-screen font-sans bg-gray-50">

      {/* TOP NAVBAR */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-md z-50">
        {isMobile && (
          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
        )}
        <h1 className="text-xl font-bold text-purple-600">Instagram</h1>
        <div className="flex items-center gap-4">
          <button>🔍</button>
          <button>❤️</button>
          <button>👤</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* DARK OVERLAY WHEN MENU OPEN (MOBILE) */}
        {isMobile && menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          ></div>
        )}

        {/* SIDEBAR */}
        <div
          className={`
            bg-white border-r border-gray-200 p-6 z-50
            ${isMobile ? "fixed top-0 left-0 h-full w-64 transform transition-transform duration-300" : "w-64"}
            ${isMobile && !menuOpen ? "-translate-x-full" : "translate-x-0"}
          `}
        >
          {isMobile && (
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✖
            </button>
          )}
          <ul className="space-y-2 mt-8">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 hover:translate-x-1">
                <span>🏠</span> Home
              </button>
            </li>
            <li>
              <Link to="/chat" className="block">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 hover:translate-x-1">
                  <span>💬</span> Messages
                </button>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="block">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all duration-200 hover:translate-x-1">
                  <span>👤</span> Profile
                </button>
              </Link>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-200 hover:translate-x-1">
                <span>🔔</span> Notifications
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:translate-x-1">
                <span>⚙️</span> More
              </button>
            </li>
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STORIES */}
          <div className="flex overflow-x-auto gap-5 pb-6 mb-6 border-b border-gray-200">
            {loading && (
              <div className="flex justify-center w-full">
                <p className="text-gray-500">Loading stories...</p>
              </div>
            )}
            {error && (
              <div className="flex justify-center w-full">
                <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
              </div>
            )}
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setProfileView(user)}
                className="flex flex-col items-center cursor-pointer min-w-[80px] transition-transform duration-200 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-orange-400 object-cover mb-2"
                  />
                  {user.online && (
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="text-xs text-gray-700 font-medium truncate max-w-[70px]">{user.username}</span>
              </div>
            ))}
          </div>

          {/* POSTS */}
          <Posts />
        </div>
      </div>
    </div>
  );
}

export default PeopleStory;
