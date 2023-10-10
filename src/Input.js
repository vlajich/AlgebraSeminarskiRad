import React from "react";
import { useEffect, useState } from "react";

function Input({ onSendMessage }) {
  const [text, setText] = useState("");
  function onChange(e) {
    const text = e.target.value;
    setText(text);
  }

  function onSubmit(e) {
    e.preventDefault();
    setText("");
    onSendMessage(text);
  }

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          onChange={(e) => onChange(e)}
          value={text}
          type="text"
          placeholder="Your text here!"
          autoFocus
        ></input>
        <button>Send</button>
      </form>
    </div>
  );
}

export default Input;
