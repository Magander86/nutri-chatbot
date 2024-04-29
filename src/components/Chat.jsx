import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import style from "./Chat.module.css";

const botName = "Nora";

const defaultMessages = [
  {
    id: Date.now() + 1,
    sender: botName,
    message: (
      <span>
        Olá, eu sou a {botName}. Será um prazer tirar suas dúvidas a respeito de{" "}
        <b> nutrição</b>
      </span>
    ),
  },
  {
    id: Date.now() + 2,
    sender: botName,
    message: (
      <span>
        Eu não substituo a ajuda de um profissional, no entanto fui treinada
        para falar sobre o tema. Então vamos lá, pode começar a digitar e
        responderei o que estiver ao meu alcance
      </span>
    ),
  },
];

function Chat() {
  const [messages, setMessages] = useState(defaultMessages);
  const [newBotMessage, setNewBotMessage] = useState("");
  const [isBotMessageEnd, setIsBotMessageEnd] = useState(false);
  // const newBotMessageRef = useRef("");
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data) => {
        console.log(data);
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
        message: <span>{newBotMessage}</span>,
      };
      setMessages((prevMessages) => [...prevMessages, botMessageObj]);

      setNewBotMessage("");
      setIsBotMessageEnd(false);
    }
  }, [isBotMessageEnd]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    socket.emit("send_message", input);

    setInput("");
  };

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

      onSubmitHandler(event);
    }
  };

  return (
    <div className="overlay">
      <div className={style["chat__body"]}>
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
              <span>{newBotMessage}</span>
            </div>
          )}
        </div>
        <form className={style["chat__form"]} onSubmit={onSubmitHandler}>
          <textarea
            className={style["chat__input"]}
            onChange={onChangeHandler}
            onKeyDown={onInputKeyPressHandler}
            value={input}
            rows="1"
            placeholder="Digite aqui"
          />
        </form>
      </div>
    </div>
  );
}

export default Chat;
