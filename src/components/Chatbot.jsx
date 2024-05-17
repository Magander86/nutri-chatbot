import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

import BotLoading from "./UI/BotLoading";
import { FaCircleXmark } from "react-icons/fa6";

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

const portalElement = document.getElementById("overlays");

function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const [newBotMessage, setNewBotMessage] = useState("");
  const [isBotMessageEnd, setIsBotMessageEnd] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  // Initial effect to connect and present the chatbot
  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit(
      "send_message",
      `se apresente com o nome de ${botName} em poucas linhas e diga que não pode substituir uma nutricionista de verdade`
    );

    setIsBotTyping(true);

    return () => {
      newSocket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);
  // updates the bot message while the backend streams the text
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
    <>
      {ReactDOM.createPortal(
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={style["chat__body"]}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={style["chat__header"]}>
              <div className={style["chat__header__bot"]}>
                <img
                  src={docGuideCropped}
                  alt="Doutora Guiando"
                  className={style["chat__bot__img"]}
                />
                <div
                  className={style["chat__bot__description"]}
                >{`${botName} - Assistente Virtual`}</div>
              </div>
              <motion.button
                type="button"
                className={style["chat__bot__close-button"]}
                whileHover={{ scale: 1.2 }}
                onClick={() => props.onChatClose()}
              >
                <FaCircleXmark />
              </motion.button>
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
                  <span style={{ whiteSpace: "pre-line" }}>
                    {newBotMessage}
                  </span>
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
              </motion.div>
            </div>
          </motion.div>
        </motion.div>,
        portalElement
      )}
    </>
  );
}

export default Chatbot;
