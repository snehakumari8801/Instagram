function AppHeader({ activeTab, profileView, searchQuery, setSearchQuery, setProfileView, handleLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      {activeTab === 'profile' && profileView ? (
        // Profile View Header
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setProfileView(null)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <img 
              src={profileView.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} 
              alt={profileView.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{profileView.name}</h2>
              <p className="text-sm text-gray-500">@{profileView.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${profileView.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-500">
              {profileView.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      ) : (
        // Main Header
        <div className="flex items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
              <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
            <h1 className="text-xl font-bold text-gray-900">ChatApp</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"/>
                  <path d="M21 21L16.65 16.65"/>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img 
                src={user.profilePic || "https://randomuser.me/api/portraits/men/1.jpg"} 
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-700">
                {user.name || 'User'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 p-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"/>
                <path d="M16 17L21 12L16 7"/>
                <path d="M21 12H9"/>
              </svg>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default AppHeader;