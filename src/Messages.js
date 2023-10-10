import { useEffect, useRef } from "react";
import React from "react";
//import styles from "@/styles/Home.module.css";

function Messages({ messages, me }) {
  const bottomRef = useRef(null);
  useEffect(function () {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <ul>
      {messages.map((message) => Message(message, me))}
      <div ref={bottomRef}></div>
    </ul>
  );
}

function Message({ member, data, id }, me) {
  const { username, color } = member.clientData;
  const messageFromMe = member.id === me.id;
  //   const className = messageFromMe
  //     ? `${styles.messagesMessage} ${styles.currentMember}`
  //     : styles.messagesMessage;

  return (
    <li key={id}>
      <span style={{ backgorundColor: color }}></span>
      <div>
        <div>{username}</div>
        <div>{data}</div>
      </div>
    </li>
  );
}

export default Messages;

//   return (
//     <li key={id} className={className}>
//       <span className={styles.avatar} style={{ backgorundColor: color }}></span>
//       <div className={styles.messageContent}>
//         <div className={styles.username}>{username}</div>
//         <div className={styles.text}>{data}</div>
//       </div>
//     </li>
