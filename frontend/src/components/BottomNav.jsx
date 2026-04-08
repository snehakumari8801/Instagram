
import React from 'react';
import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
import { BsChat, BsChatFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';

function BottomNav({ activeTab, setActiveTab, setProfileView }) {
  return (
    <>
      <nav className="instagram-bottom-nav">
        <div
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          {activeTab === 'home' ? (
            <Link to="/home">
              <AiFillHome size={24} color="#0095F6" />
            </Link>
          ) : (
            <Link to="/home">
              <AiOutlineHome size={24} color="#262626" />
            </Link>
          )}
        </div>

        <div
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          {activeTab === 'chat' ? (
            <BsChatFill size={24} color="#0095F6" />
          ) : (
            <BsChat size={24} color="#262626" />
          )}
        </div>

        <div
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('profile');
            setProfileView({
              id: 'me',
              username: 'myprofile',
              name: 'My Profile',
              avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
            });
          }}
        >
          <CgProfile
            size={24}
            color={activeTab === 'profile' ? '#0095F6' : '#262626'}
          />
        </div>
      </nav>

      <style>{`
        .instagram-bottom-nav {
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 56px;
          background-color: #fff;
          border-top: 1px solid #dbdbdb;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
        }

        .nav-item {
          flex: 1;
          text-align: center;
          padding: 12px 0;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .nav-item:hover {
          background-color: #f9f9f9;
        }

        .nav-item svg {
          transition: color 0.3s ease;
        }
      `}</style>
    </>
  );
}

export default BottomNav;
