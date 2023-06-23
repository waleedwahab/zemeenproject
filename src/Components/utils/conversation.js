import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../../Auth/firebase";
import styles from "./Conversation.module.css";
import UserNavbar from "./../Navbar/UserNavbar";

function Conversation() {
  const [messageInput, setMessageInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const conversationRef = collection(db, "conversation");
    const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
      const conversationData = snapshot.docs.map((doc) => doc.data());
      setConversation(conversationData);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchSells = async () => {
      const querySnapshot = await getDocs(collectionGroup(db, "sell"));
      const fetchedSells = querySnapshot.docs.map((doc) => doc.data());
      setUser(fetchedSells);
    };
    fetchSells();
  }, []);
  const sendMessage = async () => {
    if (messageInput.trim() === "") {
      return;
    }
    await addDoc(collection(db, "conversation"), {
      message: messageInput,
      timestamp: new Date(),
    });
    setMessageInput("");
  };

  return (
    <>
      <UserNavbar />
      <div className={styles.conversation_container}>
        <h1>{user.name}</h1>
        <div className={styles.messages_container}>
          {conversation.map((message, index) => (
            <div key={index} className={styles.message}>
              <div className={styles.message_text}>{message.message}</div>
              <div className={styles.message_timestamp}>
                {message.timestamp.toDate().toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.input_container}>
          <input
            className={styles.input}
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button className={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Conversation;
