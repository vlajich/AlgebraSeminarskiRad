import { useEffect, useRef } from "react";

function Messages({ messages, me }) {
  //svaki put kad se komponenta renderira scrollat ce se na dno (zadnja poruka)
  const bottomRef = useRef(null);
  useEffect(function () {
    bottomRef?.current.scrollIntoView({ behavior: "smooth" });
  });
  console.log(me);
  return (
    <ul className="messages">
      {messages.map((message) => (
        <Message message={message} me={me} key={message.id} />
      ))}
      {/* koristimo ref za selektiranje DOM Elemenata, scrollIntoView će se tu skrolati */}
      <div ref={bottomRef}></div>
    </ul>
  );
}

function Message({ message, me }) {
  const { member, data } = message;
  const { username, color } = member.clientData;
  console.log(member);
  const messageFromMe = member.id === me.id;
  console.log(messageFromMe);
  console.log(member.id);
  console.log(me.id);

  return (
    <li className={messageFromMe ? "message my-message" : "message"}>
      <div style={{ backgroundColor: color }}></div>
      <div>
        <span style={{ color: color }}>{username}</span>
        <div>
          <p>{data}</p>
        </div>
      </div>
    </li>
  );
}

export default Messages;
