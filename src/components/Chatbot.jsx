import ReactDOM from "react-dom";

import Chat from "./Chat";

const portalElement = document.getElementById("overlays");

function Chatbot() {
  return (
    <>      
      {ReactDOM.createPortal(<Chat />, portalElement)}
    </>
  );
}

export default Chatbot;
