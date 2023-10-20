function TypingIndicator({ members }) {
  //passali smo samo membere koje imaju  property typing i koje nisu ja
  //   const typingMembers = members.filter(
  //     (member) => member.typing && member.id !== me.id
  //   );
  console.log(members);
  const names = members.map((member) => member.clientData.username);
  if (names.length === 0) {
    return <div className="typing-container"></div>;
  }

  if (names.length === 1) {
    return <div className="typing-container typing">{names[0]} is typing</div>;
  }

  const string = names.slice(0, -1).join(", ") + " and " + names.slice(-1);

  return <div className="typing-container typing">{string} are typing</div>;
}

export default TypingIndicator;
