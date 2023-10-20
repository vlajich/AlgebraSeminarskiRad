import "../styles/App.css";
import "../styles/index.css";
import React from "react";
import { useState, useRef, useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";
import Members from "./Members";
import TypingIndicator from "./TypingIndicator";
import Modal from "./Modal";

/////////////////////ODABIR IMENA I BOJE////////////////
// prettier-ignore
/*function randomName() {
  const adjectives = [
    'autumn', 'hidden', 'bitter', 'misty', 'silent', 'empty', 'dry', 'dark',
    'summer', 'icy', 'delicate', 'quiet', 'white', 'cool', 'spring', 'winter',
    'patient', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered', 'blue',
    'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green', 'long',
    'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old', 'red',
    'rough', 'still', 'small', 'sparkling', 'shy', 'wandering',
    'withered', 'wild', 'black', 'young', 'holy', 'solitary', 'fragrant',
    'aged', 'snowy', 'proud', 'floral', 'restless', 'divine', 'polished',
    'ancient', 'purple', 'lively', 'nameless'
  ];
  const nouns = [
    'waterfall', 'river', 'breeze', 'moon', 'rain', 'wind', 'sea', 'morning',
    'snow', 'lake', 'sunset', 'pine', 'shadow', 'leaf', 'dawn', 'glitter',
    'forest', 'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird', 'brook',
    'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower', 'firefly',
    'feather', 'grass', 'haze', 'mountain', 'night', 'pond', 'darkness',
    'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf', 'thunder',
    'violet', 'water', 'wildflower', 'wave', 'water', 'resonance', 'sun',
    'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper', 'frog',
    'smoke', 'star'
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + ' ' + noun;
}*/

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}
////////////////////////////////////////////////////////

//POVEZIVANJE NA KANAL
let drone = null;
const CHANNEL_ID = "r3V3laXpyK3vvSL1";

export default function App() {
  function submitUser(username) {
    setMe({ ...me, username: username, color: randomColor() });
  }

  const [messages, setMessages] = useState([]);

  const [members, setMembers] = useState([]); //definiranje početnih membersa

  const [me, setMe] = useState({}); //početno kad se loada stranica me je prazan objekt;
  //kad odredimo username onda se kreira i username i boja

  //////////////////////////////////

  // satvaljamo u useRef hook da se ne mijenja između renderiranja
  const messagesRef = useRef();
  messagesRef.current = messages;
  const membersRef = useRef();
  membersRef.current = members;
  const meRef = useRef();
  meRef.current = me;

  console.log(me);
  function connectToScaledrone() {
    //KREIRA SE INSTANCA SCALEDRONA
    drone = new window.Scaledrone(CHANNEL_ID, {
      data: meRef.current,
    });
    ////// SCALEDRONE EVENT, ZNAČI: CONNECTION HAS BEEN OPENED
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      console.log(me);
      meRef.current.id = drone.clientId; //meRef su smo dodali ID od clienID-a koji je definirao Scalerdrone
      setMe(meRef.current);
    });
    //SUBSCRIBE NA ROOM KAKO BI SLUŠALI PORUKE
    //OBESRVABLE ROOM IMAJU FUNKCIONALNOST DA PRATE TKO JE ONLINE I
    //DA LINKAJU MESSAGES PREMA MEMBERS
    console.log(meRef.current);
    const room = drone.subscribe("observable-room");

    //ROOM EVENT
    //PRIMITAK MESSAGEA(data, id, timestamp, clientID, member) IZ ROOMA
    room.on("message", (message) => {
      console.log(message);
      const { data, member } = message; //destrukturiranje data i member
      if (typeof data === "object" && typeof data.typing === "boolean") {
        //kada tipkamo data je objekt i unutra property typing=boolean, kad pošaljemo poruku onda je data string i to samo tekst poruke
        const newMembers = [...membersRef.current];
        const index = newMembers.findIndex((m) => m.id === member.id); //povezuje koji je member iz statea-a jednak memberu iz poruke
        newMembers[index].typing = data.typing; //zadaje mu property typing=true ili false
        setMembers(newMembers);
      } else {
        setMessages([...messagesRef.current, message]);
      }
    });
    //FUNKCIONALNOST WHO'S ONLINE
    //MEMBERS EVENT - daje array membera koji su se joinali, triggera
    //se jednom i to kad se user spoji
    room.on("members", (members) => {
      setMembers(members);
    });

    //MEMBER JOIN EVENT- TRIGGERA SE KAD SE NOVI MEMEBER SPOJI
    room.on("member_join", (member) => {
      setMembers([...membersRef.current, member]); //updejt state-a
    });

    //MEMBER LEAVE EVENT - TRIGGERA SE KAD MEMBER NAPUSTI ROOM I UPDEJTA MEMBERE
    room.on("member_leave", ({ id }) => {
      const index = membersRef.current.findIndex((m) => m.id === id);
      const newMembers = [...membersRef.current];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    });
  }
  //tek kad korisnik odredi svoj username pozvat će se Scaledrone
  useEffect(() => {
    if (drone === null && me.username) {
      connectToScaledrone();
    }
  }, [me.username]);
  //CALL-BACK FUNKCIJA KOJA PRIMI TEXT IZ Inputa i onda šalje poruku
  function onSendMessage(message) {
    if (message === "") return;
    drone.publish({
      room: "observable-room",
      message,
    });
  }
  //CALL-BACK FUNCKIJA KOJU ŠALJEMO U Input za updejatanje typing propertyja
  function onChangeTypingState(isTyping) {
    drone.publish({
      room: "observable-room",
      message: { typing: isTyping },
    });
  }

  return (
    <main>
      <Modal submitUser={submitUser} me={me}></Modal>

      <div className="chat-app">
        <Members members={members} me={me} />{" "}
        {/* upravlja zaglavljem gdje se prikazuje tko je online */}
        <Messages messages={messages} me={me} />
        <TypingIndicator
          members={members.filter((m) => m.typing && m.id !== me.id)}
          me={me}
        />
        <Input
          onSendMessage={onSendMessage}
          onChangeTypingState={onChangeTypingState}
          me={me}
        />
      </div>
    </main>
  );
}
