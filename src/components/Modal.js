import { useState } from "react";
function Modal({ submitUser, me }) {
  const [value, setValue] = useState("");

  function onChange(e) {
    setValue(e.target.value);
    console.log(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    submitUser(value);
  }
  const { username } = me;
  return (
    <div className={username ? "hidden" : ""}>
      <div className="modal">
        <h2>WELCOME TO DRAZAN VLAJIC'S SCALEDRONE CHAT!</h2>
        <h4>Please, enter you username</h4>
        <ul>
          <li>👉Maximum 20 characters</li>
          <li>👉Minimum 3 characters</li>
          <li>
            👉Allowed: numbers, english alphabet letters, underscore and hyphen
            signs
          </li>
        </ul>

        <form onSubmit={(e) => onSubmit(e)}>
          <label for="username">Username: </label>
          <input
            className=""
            onChange={(e) => onChange(e)}
            type="text"
            value={value}
            maxLength={20}
            minLength={3}
            pattern="^[a-zA-Z0-9_\-]+$"
            autoFocus
          ></input>
          <button>Join!</button>
        </form>
      </div>
      <div className="overlay"></div>
    </div>
  );
}

export default Modal;
