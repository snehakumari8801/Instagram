import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineSend,
} from "react-icons/ai";
import api from "../utils/api";

const dummyPosts = [
  {
    id: 1,
    username: "nature_lover",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    image:
      "https://images.pexels.com/photos/7086762/pexels-photo-7086762.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Loving the greenery 🌿",
    time: "10m ago",
    comments: ["Beautiful!", "Where is this?"],
    liked: false,
    likesCount: 120,
  },
  {
    id: 2,
    username: "cityscape",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    image:
      "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "City lights at night ✨",
    time: "25m ago",
    comments: ["Amazing shot!", "I love this view!"],
    liked: false,
    likesCount: 98,
  },
  {
    id: 3,
    username: "foodie",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    image:
      "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Delicious homemade pasta 🍝",
    time: "1h ago",
    comments: ["Yummy!", "Recipe please!"],
    liked: false,
    likesCount: 256,
  },
  {
    id: 4,
    username: "adventure_seeker",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    image:
      "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Mountain hikes are the best 🏔️",
    time: "2h ago",
    comments: ["Take me there!", "Wow!"],
    liked: false,
    likesCount: 87,
  },
  {
    id: 5,
    username: "artlover",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    image:
      "https://images.pexels.com/photos/21264/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
    caption: "Inspired by this beautiful mural 🎨",
    time: "3h ago",
    comments: ["So colorful!", "Love this!"],
    liked: false,
    likesCount: 143,
  },
  {
    id: 6,
    username: "sunset_chaser",
    avatar: "https://randomuser.me/api/portraits/men/53.jpg",
    image:
      "https://images.pexels.com/photos/462353/pexels-photo-462353.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Golden hour magic 🌅",
    time: "4h ago",
    comments: ["Stunning!", "Perfect shot!"],
    liked: false,
    likesCount: 210,
  },
  {
    id: 7,
    username: "petlover",
    avatar: "https://randomuser.me/api/portraits/women/75.jpg",
    image:
      "https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "My cute puppy 🐶",
    time: "5h ago",
    comments: ["Aww!", "So adorable!"],
    liked: false,
    likesCount: 300,
  },
  {
    id: 8,
    username: "fashionista",
    avatar: "https://randomuser.me/api/portraits/women/80.jpg",
    image:
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "OOTD vibes 👗",
    time: "6h ago",
    comments: ["Love your style!", "Great outfit!"],
    liked: false,
    likesCount: 190,
  },
  {
    id: 9,
    username: "travel_bug",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    image:
      "https://images.pexels.com/photos/221164/pexels-photo-221164.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Exploring new places 🌍",
    time: "7h ago",
    comments: ["Jealous!", "Looks amazing!"],
    liked: false,
    likesCount: 150,
  },
  {
    id: 10,
    username: "coffee_addict",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Morning coffee ritual ☕",
    time: "8h ago",
    comments: ["Need this now!", "So cozy!"],
    liked: false,
    likesCount: 134,
  },
];

function Posts() {
  const [posts, setPosts] = useState(dummyPosts);
  const [commentBoxOpen, setCommentBoxOpen] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  // const [dummyPosts, setDummyPosts] = useState(null);

  //  const fetchData = async () => {
  //   try {
  //     let res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/user/getAllPosts`);
  //     console.log(res.data.posts);
  //     setPosts(res.data.posts);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/user/getAllPosts`,
      );
      let userId = JSON.parse(localStorage.getItem("user")); // parse string to object
      userId = userId._id; // get the ID
      console.log(userId);

      const postsWithLiked = res.data.posts.map((post) => ({
        ...post,
        liked: post.likes.includes(userId), // true if user already liked
        likesCount: post.likes.length,
      }));

      setPosts(postsWithLiked);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(posts);

  useEffect(() => {
    fetchData();
  }, []);

  // const toggleLike = (id) => {
  //   console.log(id);

  //   setPosts((prev) =>
  //     prev.map((post) =>
  //       post._id === id
  //         ? {
  //             ...post,
  //             liked: !post.liked,
  //             likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
  //           }
  //         : post
  //     )
  //   );
  // };

  const toggleLike = async (id) => {
    try {
      const res = await api.post(`/user/postLike/${id}`);
      console.log(res.data);
      setPosts((prev) =>
        prev.map((post) =>
          post._id == id
            ? {
                ...post,
                liked: res.data.liked,
                likes: res.data.likes,
                likesCount: res.data.likeCount,
              }
            : post,
        ),
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleCommentBox = (id) => {
    setCommentBoxOpen(commentBoxOpen === id ? null : id);
    setCommentInput("");
  };

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const addComment = (id) => {
    if (!commentInput.trim()) return;

    setPosts((prev) =>
      prev.map((post) =>
        post._id === id
          ? {
              ...post,
              comments: [...post.comments, commentInput.trim()],
            }
          : post,
      ),
    );
    setCommentInput("");
  };

  return (
    <>
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {/* Post header */}
            <div className="post-header">
              <img
                src={post.user?.profilePic}
                alt={post.user?.name}
                className="avatar"
              />
              <span className="username">{post.user?.name}</span>
            </div>

            {/* Post image */}
            <img src={post.image} alt="post" className="post-image" />

            {/* Post actions */}
            <div className="post-actions">
              <span
                onClick={() => toggleLike(post._id)}
                className="action-icon"
              >
                {post.liked ? (
                  <AiFillHeart size={24} color="#e74c3c" />
                ) : (
                  <AiOutlineHeart size={24} />
                )}
              </span>

              <span
                onClick={() => toggleCommentBox(post.id)}
                className="action-icon"
              >
                <AiOutlineComment size={24} />
              </span>

              <span className="action-icon">
                <AiOutlineSend size={24} />
              </span>
            </div>

            {/* Likes count */}
            {post.likesCount > 0 && (
              <div className="likes-count">
                {post.likesCount.toLocaleString()}{" "}
                {post.likesCount === 1 ? "like" : "likes"}
              </div>
            )}

            {/* Caption */}
            <div className="post-caption">
              <span className="username">{post.username}</span> {post.caption}
            </div>

            {/* Comments */}
            <div className="post-comments">
              {post.comments.map((comment, i) => {
                // Split username from comment if any, here just comment text only
                return (
                  <p key={i}>
                    <span className="comment-username">user</span> {comment}
                  </p>
                );
              })}
            </div>

            {/* Comment box */}
            {commentBoxOpen === post.id && (
              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={handleCommentChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addComment(post.id);
                  }}
                />
                <button onClick={() => addComment(post.id)}>Post</button>
              </div>
            )}

            {/* Time */}
            <div className="post-time">{post.time}</div>
          </div>
        ))}
      </div>

      <style>{`
        .posts-container {
          max-width: 600px;
          margin: 20px auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .post-card {
          border: 1px solid #dbdbdb;
          background: white;
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .post-header {
          display: flex;
          align-items: center;
          padding: 14px 16px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 12px;
          object-fit: cover;
          border: 1.5px solid #dbdbdb;
        }

        .username {
          font-weight: 600;
          font-size: 14px;
          color: #262626;
          cursor: pointer;
        }

        .post-image {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
        }

        .post-actions {
          display: flex;
          align-items: center;
          padding: 8px 16px;
        }

        .action-icon {
          cursor: pointer;
          margin-right: 16px;
          user-select: none;
        }

        .likes-count {
          padding: 0 16px;
          font-weight: 600;
          font-size: 14px;
          color: #262626;
          margin-bottom: 6px;
        }

        .post-caption {
          padding: 0 16px 8px;
          font-size: 14px;
          color: #262626;
          line-height: 1.3;
        }

        .post-caption .username {
          margin-right: 6px;
        }

        .post-comments {
          padding: 0 16px 8px;
        }

        .post-comments p {
          margin: 4px 0;
          font-size: 14px;
          color: #262626;
          line-height: 1.3;
        }

        .comment-username {
          font-weight: 600;
          color: #00376b;
          margin-right: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: text-decoration 0.2s ease;
        }

        .comment-username:hover {
          text-decoration: underline;
        }

        .comment-box {
          display: flex;
          padding: 0 16px 10px;
          border-top: 1px solid #efefef;
        }

        .comment-box input {
          flex-grow: 1;
          border: none;
          outline: none;
          font-size: 14px;
          padding: 10px 12px;
        }

        .comment-box button {
          border: none;
          background: none;
          color: #0095f6;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 12px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .comment-box button:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .post-time {
          padding: 0 16px 12px;
          font-size: 10px;
          color: #8e8e8e;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </>
  );
}

export default Posts;
