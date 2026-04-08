
import React, { useRef, useState } from "react";
import axios from "axios";

function ProfileView({ profile }) {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [openpostModel, setOpenPostModel] = useState(false);

  const token = localStorage.getItem("authToken");
  const userId = user?._id;

  // Profile Picture Preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  // Image / Video Preview
  const handlePostFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") setImagePreview(URL.createObjectURL(file));
    if (type === "video") setVideoPreview(URL.createObjectURL(file));
  };

  // Upload Profile Pic
  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return alert("Select a file first!");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePic", file);

      let res = await axios.put(
        `http://localhost:8000/api/v1/user/updateProfile/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.data));
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      setShowModal(false);
      setPreview(null);
    }
  };

  // Upload Post (Image + Video)
  const handlePost = async () => {
    const img = imageInputRef.current.files[0];
    const vid = videoInputRef.current.files[0];

    if (!img && !vid) return alert("Select an image or video!");

    try {
      setUploading(true);
      const formData = new FormData();
      if (img) formData.append("image", img);
      if (vid) formData.append("video", vid);
      formData.append("userId", userId);

      let res = await axios.post(
        `http://localhost:8000/api/v1/user/postImageVideo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      alert("Post uploaded!");

    } catch (err) {
      console.log(err);
      alert("Failed to upload!");
    } finally {
      setUploading(false);
      setOpenPostModel(false);
    }
  };

  return (
    <div className="profile-container">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
            src={user.profilePic || "https://via.placeholder.com/100"}
            alt={user.name}
            className="profile-avatar"
          />
        </div>
        <div className="profile-info">
          <h2>{user.name || "User Name"}</h2>
          <p className="username">@{user.name || "username"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div><strong>125</strong><span>Posts</span></div>
        <div><strong>1,234</strong><span>Followers</span></div>
        <div><strong>567</strong><span>Following</span></div>
      </div>

      {/* Buttons */}
      <div className="profile-actions flex justify-between w-[100%] gap-6">
        <button className="edit-btn" onClick={() => setOpenPostModel(true)}>
          Post
        </button>

        <button className="edit-btn" onClick={() => setShowModal(true)}>
          ✏️ Edit Profile Picture
        </button>
      </div>

      {/*❗ POST MODAL (IMAGE + VIDEO UPLOAD) */}
      {openpostModel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              minWidth: "350px",
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              border: "2px solid black",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
              Upload New Post
            </h3>

            {/* Upload Image Button */}
            <label
              style={{
                padding: "12px",
                background: "#007bff",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => handlePostFileSelect(e, "image")}
                style={{ display: "none" }}
              />
            </label>

            {/* Upload Video Button */}
            <label
              style={{
                padding: "12px",
                background: "#28a745",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Upload Video
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={(e) => handlePostFileSelect(e, "video")}
                style={{ display: "none" }}
              />
            </label>

            {/* Submit */}
            <button
              onClick={handlePost}
              style={{
                padding: "12px 25px",
                background: "#0095f6",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {uploading ? "Uploading..." : "Submit Post"}
            </button>

            {/* Close */}
            <button
              onClick={() => setOpenPostModel(false)}
              style={{
                padding: "8px 15px",
                background: "#ff4d4d",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/*❗ PROFILE PICTURE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Profile Picture</h3>

            {preview ? (
              <img src={preview} alt="preview" className="preview-img" />
            ) : (
              <p>No image selected</p>
            )}

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} />

            <div className="modal-actions">
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>

              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .profile-container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          font-family: sans-serif;
          background: #fafafa;
          border-radius: 8px;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid #0095f6;
          object-fit: cover;
        }

        .profile-stats {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }

        .edit-btn {
          padding: 10px 15px;
          background: #0095f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .preview-img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}

export default ProfileView;

