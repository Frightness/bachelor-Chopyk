import { useParams, useNavigate } from "react-router-dom";
import "./RoomPage.css";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, arrayUnion, arrayRemove, deleteField } from "firebase/firestore";
import { IconButton, TextField, Typography } from "@mui/material";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogOutIcon from "../../assets/LogOutIcon.svg";
import Divider from "@mui/material/Divider";
import YouTube from "react-youtube";
import { format } from "date-fns";

export default function RoomPage() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            uid: user.uid,
            ...data
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!roomID || !userData || !userData.username || !userData.avatarUrl) return;

    const roomRef = doc(db, "rooms", roomID);
    const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        setRoomInfo(roomData);
        
        const participantsObj = roomData.participants || {};
        const currentParticipants = Object.values(participantsObj).filter(
          p => p && p.username && p.avatarUrl && p.uid
        );
        setParticipants(currentParticipants);

        const isParticipant = currentParticipants.some(p => p.uid === userData.uid);
        
        if (!isParticipant) {
          const participantData = {
            uid: userData.uid,
            username: userData.username,
            avatarUrl: userData.avatarUrl,
            joinedAt: new Date(),
            lastActivity: Date.now()
          };
          
          await updateDoc(roomRef, {
            [`participants.${userData.uid}`]: participantData
          });
        }
      }
    });

    return () => {
      if (userData && userData.username && userData.avatarUrl) {
        updateDoc(roomRef, {
          [`participants.${userData.uid}`]: deleteField()
        });
      }
      unsubscribe();
    };
  }, [roomID, userData]);

  useEffect(() => {
    if (!roomID || !userData || !userData.username || !userData.avatarUrl) return;

    const roomRef = doc(db, "rooms", roomID);
    let lastActivity = Date.now();

    const activityInterval = setInterval(async () => {
      if (userData) {
        const participantData = {
          uid: userData.uid,
          username: userData.username,
          avatarUrl: userData.avatarUrl,
          lastActivity: Date.now()
        };

        try {
          await updateDoc(roomRef, {
            [`participants.${userData.uid}`]: participantData
          });
        } catch (error) {
          console.error("Error updating activity:", error);
        }
      }
    }, 30000);

    const cleanupInterval = setInterval(async () => {
      try {
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          const roomData = docSnap.data();
          const participants = roomData.participants || {};
          const now = Date.now();
          
          const activeParticipants = Object.values(participants).filter(
            p => (now - p.lastActivity) < 60000
          );

          await updateDoc(roomRef, {
            participants: activeParticipants
          });
        }
      } catch (error) {
        console.error("Error cleaning inactive users:", error);
      }
    }, 60000);

    const handleUnload = async () => {
      if (userData) {
        try {
          const participantData = {
            uid: userData.uid,
            username: userData.username,
            avatarUrl: userData.avatarUrl
          };
          
          await updateDoc(roomRef, {
            participants: arrayRemove(participantData)
          });
        } catch (error) {
          console.error("Error removing participant:", error);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(activityInterval);
      clearInterval(cleanupInterval);
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
  }, [roomID, userData]);

  useEffect(() => {
    if (!roomID) return;

    const q = query(
      collection(db, "rooms", roomID, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArr = [];
      querySnapshot.forEach((doc) => {
        messagesArr.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesArr);
    });

    return () => unsubscribe();
  }, [roomID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !userData) return;

    try {
      await addDoc(collection(db, "rooms", roomID, "messages"), {
        text: newMessage,
        username: userData.username,
        avatarUrl: userData.avatarUrl,
        createdAt: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLeaveRoom = async () => {
    if (userData && roomID) {
      const roomRef = doc(db, "rooms", roomID);
      
      try {
        const participantData = {
          uid: userData.uid,
          username: userData.username,
          avatarUrl: userData.avatarUrl
        };
        
        await updateDoc(roomRef, {
          participants: arrayRemove(participantData)
        });

        navigate('/rooms');
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    }
  };

  return (
    <div className="roomWrapper">
      {roomInfo.streamSource === "YouTube" ? (
        <YouTube
          videoId={getYouTubeVideoId(roomInfo.videoUrl)}
          opts={opts}
          onReady={onPlayerReady}
          className="video"
        />
      ) : (
        <video controls className="video" src={roomInfo.videoUrl}></video>
      )}

      <div className="sideBar">
        <div className="sideBarHeader">
          <IconButton
            aria-label="room setting"
            size="large"
            className="iconButton"
          >
            <img
              src={SettingsIcon}
              alt="Settings room"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>

          <Typography sx={{ fontWeight: "bold" }}>
            {roomInfo.roomName}
          </Typography>

          <IconButton 
            aria-label="logout" 
            size="large" 
            className="iconButton"
            onClick={handleLeaveRoom}
          >
            <img
              src={LogOutIcon}
              alt="Leave room"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>
        </div>
        <Divider sx={{ backgroundColor: "white" }} />

        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </div>
          <div 
            className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants ({participants.length})
          </div>
        </div>
        
        {activeTab === 'chat' ? (
          <div className="roomChat">
            <div className="messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.username === userData?.username ? 'sent' : ''}`}>
                  <div className="chatAvatarWrapper">
                    <img src={msg.avatarUrl} alt={msg.username} className="avatar" />
                  </div>
                  <div className="messageContent">
                    <div className="messageText">{msg.text}</div>
                    <div className="messageInfo">
                      <span className="username">{msg.username}</span>
                      <span className="timestamp">
                        {msg.createdAt &&
                          format(
                            new Date(msg.createdAt.seconds * 1000),
                            "HH:mm"
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="messageForm">
              <TextField
                className="chatMessageField"
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-root": {
                    outline: "none",
                  },
                }}
              />
              <IconButton type="submit" className="sendButton">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </IconButton>
            </form>
          </div>
        ) : (
          <div className="participantsList">
            {participants.map((participant) => (
              participant && participant.username && participant.avatarUrl ? (
                <div key={participant.uid} className="participant">
                  <div className="participantAvatar">
                    <img
                      src={participant.avatarUrl}
                      alt={participant.username}
                    />
                  </div>
                  <div className="participantInfo">
                    <div className="participantName">{participant.username}</div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
}