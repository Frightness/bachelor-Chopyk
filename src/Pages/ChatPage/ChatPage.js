import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { format } from "date-fns";
import "./ChatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const currentUser = userData
    ? {
        username: userData.username,
        avatarUrl: userData.avatarUrl,
      }
    : null;

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messagesArr = [];
      querySnapshot.forEach((doc) => {
        messagesArr.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesArr);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "" && currentUser) {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        createdAt: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <div className="chatWrapper">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="chatAvatarWrapper">
              <img src={msg.avatarUrl} alt={msg.username} className="avatar" />
            </div>
            <div className="messageContent">
              <div className="messageHeader">
                <span className="username">{msg.username}</span>
                <span className="timestamp">
                  {msg.createdAt &&
                    format(
                      new Date(msg.createdAt.seconds * 1000),
                      "dd MMM yyyy, HH:mm"
                    )}
                </span>
              </div>
              {msg.text && <p className="messageText">{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="inputForm">
        <input
          type="text"
          value={newMessage}
          className="chatField"
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
