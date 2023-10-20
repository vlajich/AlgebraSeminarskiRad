import { useEffect, useState } from "react";
//@ts-ignore
import TypingIndicator from "typing-indicator";

let typingIndicator = null;

function Input({ onSendMessage, onChangeTypingState, me }) {
  const [text, setText] = useState("");

  //ovo napravi message s isTyping objektom
  useEffect(() => {
    if (typingIndicator === null) {
      typingIndicator = new TypingIndicator();
      typingIndicator.listen((isTyping) => onChangeTypingState(isTyping));
    }
  }, [onChangeTypingState]);

  //s typingindicatorom biljezimo i text koj se mijenja
  function onChange(e) {
    const text = e.target.value;
    typingIndicator.onChange(text);
    setText(text);
  }

  function onSubmit(e) {
    e.preventDefault();
    setText("");
    onSendMessage(text);
  }

  return (
    <div className="form-container">
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          onChange={(e) => onChange(e)}
          value={text}
          type="text"
          placeholder="Start typing..."
        ></input>
        <button>Send</button>
      </form>
    </div>
  );
}

export default Input;
