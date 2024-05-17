import { useState, useEffect } from "react";

import ChatCallToAction from "./components/ChatCallToAction";
import Chatbot from "./components/Chatbot";
import DocPointing from "./assets/female-doctor-pointing-a-finger-svgrepo-com.svg";
import DocGuide from "./assets/female-doctor-to-guide-svgrepo-com.svg";

function App() {
  const [isShowingChatCallToAction, setIsShowingChatCall] = useState(false);

  useEffect(() => {
    if (!isShowingChatCallToAction) {
      document.body.classList.remove("modal-open");
    }
  }, [isShowingChatCallToAction]);

  const chatCallClickHandler = () => {
    setIsShowingChatCall(true);
    document.body.classList.add("modal-open");
  };

  return (
    <>
      {!isShowingChatCallToAction && (
        <ChatCallToAction onClick={chatCallClickHandler} />
      )}
      {isShowingChatCallToAction && (
        <Chatbot onChatClose={() => setIsShowingChatCall(false)} />
      )}

      <div className="title">
        <h1 className="title__name">Nora Chatbot</h1>
      </div>
      <div className="info">
        <div className="info__text">
          <h2>SAÚDE EM PRIMEIRO LUGAR</h2>
          <p>
            Nosso Chatbot está aqui para te ajudar na sua alimentação, tornando
            tudo mais fácil e sem complicações!
          </p>
        </div>
        <img
          className="info__image"
          src={DocPointing}
          alt="Doutora Apontando"
        />
      </div>
      <div className="presentation">
        <img
          className="presentation__img"
          src={DocGuide}
          alt="Doutora Guiando"
        />
        <div className="presentation__text">
          <h3>Conheça a Nora</h3>
          <p>Olá? Tudo bem?</p>
          <p>
            Eu sou a nutricionista Nora, um bot de saúde com intuito de auxiliar
            e capacitar pessoas com a própria alimentação. Minhas orientações
            têm a finalidade de tornar sua dieta mais balanceada. Em nossa
            conversa, eu dou dicas de como obter uma melhor alimentação. Estou
            aqui para ajudar. Para conversar comigo e saber mais, é só iniciar
            uma conversa.
          </p>
        </div>
      </div>
      <div className="contact">
        <h4>Contato</h4>
        <p>nora.chatbot@nutri.com</p>
      </div>
    </>
  );
}

export default App;
