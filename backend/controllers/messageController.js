const { video } = require("../lib/cloudinary");
const Message = require("../modals/Message");
const User = require("../modals/User");

exports.getAllUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user?.userId;
    // console.log(loggedInUserId)

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "name email profilePic _id"
    ); // Select only necessary fields

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No other users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched users",
      data:users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const myId = req.user.userId;
    const userToChatId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    if (!messages) {
      return res.status(401).json({
        success: false,
        message: "Error while fetching messages",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetch chats successfully!",
      messages
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// exports.sendMessage = async (req, res) => {
//   try {
//     // const pic = req.file?.path || null; // Cloudinary URL (if used)
//     const pic = req.files?.pic?.[0]?.path || null;
//     const video = req.files?.video?.[0]?.path || null;


//     const text = req.body.text;   // message content
//     const receiverId = req.params.id; // assuming route is /send/:receiverId
//     const senderId = req.user.userId;

//     if (!receiverId || (!text && !pic && !video)) {
//       return res.status(400).json({
//         success: false,
//         message: "Message must have at least text, image, or video",
//       });
//     }

//     const message = new Message({
//       senderId,
//       receiverId,
//       text,
//       pic,
//       video,
//     });

//     await message.save();

//     return res.status(200).json({
//       success: true,
//       message: "Message sent successfully",
//       data: message,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };



const { io, onlineUsers } = require("../lib/socket");

exports.sendMessage = async (req, res) => {
  try {
    const pic = req.files?.pic?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    const text = req.body.text;
    const receiverId = req.params.id;
    const senderId = req.user.userId;

    if (!receiverId || (!text && !pic && !video)) {
      return res.status(400).json({
        success: false,
        message: "Message must have at least text, image, or video",
      });
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      pic,
      video,
    });

    await message.save();

    // 🔥 STEP 3A — Find receiver socket
    // const receiverSocketId = onlineUsers[receiverId];

    // // 🔥 STEP 3B — Emit to receiver if online
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("receive_message", message);
    // }

    // // 🔥 STEP 3C — Emit back to sender (optional but recommended)
    // const senderSocketId = onlineUsers[senderId];
    // if (senderSocketId) {
    //   io.to(senderSocketId).emit("receive_message", message);
    // }

    return res.status(200).json({
      success: true,
      data: message,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
