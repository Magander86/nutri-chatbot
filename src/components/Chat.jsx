import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";

import BotLoading from "./UI/BotLoading";

import docGuideCropped from "../assets/female-doctor-guide-cropped.png";
import style from "./Chat.module.css";

const botName = "Nora";

const inputVariants = {
  typing: {
    width: 80,
  },
  input: {
    with: "80%",
  },
};

// const defaultMessages = [
//   {
//     id: Date.now() + 1,
//     sender: botName,
//     message: (
//       <span>
//         Olá, eu sou a {botName}. Será um prazer tirar suas dúvidas a respeito de{" "}
//         <b> nutrição</b>
//       </span>
//     ),
//   },
//   {
//     id: Date.now() + 2,
//     sender: botName,
//     message: (
//       <span>
//         Eu não substituo a ajuda de um profissional, no entanto fui treinada
//         para falar sobre o tema. Então vamos lá, pode começar a digitar e
//         responderei o que estiver ao meu alcance
//       </span>
//     ),
//   },
// ];

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newBotMessage, setNewBotMessage] = useState("");
  const [isBotMessageEnd, setIsBotMessageEnd] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);

    // newSocket.emit("send_message", "se apresente em poucas linhas e diga que não pode substituir uma nutricionista de verdade");

    // setIsBotTyping(true);

    return () => {
      newSocket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data) => {
        setNewBotMessage((prevMessages) => {
          return prevMessages + data;
        });
      });

      socket.on("message_end", () => {
        setIsBotMessageEnd(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (isBotMessageEnd) {
      const botMessageObj = {
        id: Date.now() + botName,
        sender: botName,
        message: (
          <span style={{ whiteSpace: "pre-line" }}>{newBotMessage}</span>
        ),
      };
      setMessages((prevMessages) => [...prevMessages, botMessageObj]);

      setNewBotMessage("");
      setIsBotMessageEnd(false);
      setIsBotTyping(false);
    }
  }, [isBotMessageEnd]);

  const onChangeHandler = (event) => {
    setInput(event.target.value);
  };

  const onInputKeyPressHandler = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      setMessages((prevValues) => {
        // Split inputs by line breaks
        const lines = input.split("\n");

        const newMessage = {
          id: Date.now() + "user",
          sender: "user",
          message: lines.map((line, index) => (
            <span key={index}>
              {line}
              {index < lines.length - 1 && <br />}{" "}
              {/* Add <br> except for the last line */}
            </span>
          )),
        };

        return [...prevValues, newMessage];
      });

      setIsBotTyping(true);
      socket.emit("send_message", input);

      setInput("");
    }
  };

  return (
    <div className="overlay">
      <div className={style["chat__body"]}>
        <div className={style["chat__header"]}>
          <img
            src={docGuideCropped}
            alt="Doutora Guiando"
            className={style["chat__bot__img"]}
          />
          <div
            className={style["chat__bot__description"]}
          >{`${botName} - Assistente Virtual`}</div>
        </div>
        <div className={style["chat__messages"]}>
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                className={
                  message.sender === botName
                    ? style["chat__bot-message"]
                    : style["chat__user-message"]
                }
              >
                {message.message}
              </div>
            );
          })}
          {newBotMessage && (
            <div className={style["chat__bot-message"]}>
              <span style={{ whiteSpace: "pre-line" }}>{newBotMessage}</span>
            </div>
          )}
        </div>

        <div className={style["chat__form"]}>
          <motion.div
            className={style["chat__input-box"]}
            variants={inputVariants}
            animate={isBotTyping ? "typing" : "input"}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <AnimatePresence initial={false}>
              {!isBotTyping && (
                <textarea
                  className={style["chat__input"]}
                  onChange={onChangeHandler}
                  onKeyDown={onInputKeyPressHandler}
                  value={input}
                  rows="1"
                  placeholder="Digite aqui"
                />
              )}
              {isBotTyping && <BotLoading />}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
