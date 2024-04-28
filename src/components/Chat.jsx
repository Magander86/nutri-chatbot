import { useState, useEffect } from "react";
import axios from "axios";

import style from "./Chat.module.css";

const botName = "Nora";

const defaultMessages = [
  {
    id: Date.now() + 1,
    sender: botName,
    message: (
      <p>
        Olá, eu sou a {botName}. Será um prazer tirar suas dúvidas a respeito de{" "}
        <b> nutrição</b>
      </p>
    ),
  },
  {
    id: Date.now() + 2,
    sender: botName,
    message: (
      <p>
        Eu não substituo a ajuda de um profissional, no entanto fui treinada
        para falar sobre o tema. Então vamos lá, pode começar a digitar e
        responderei o que estiver ao meu alcance
      </p>
    ),
  },
];

function Chat() {
  const [messages, setMessages] = useState(defaultMessages);
  const [input, setInput] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const message = { message: input };

    setInput("");

    console.log("request sent");

    const response = await axios
      .post("http://localhost:5000/api/v1/claudechat", message)
      .then((res) => res.data.content[0].text)
      .catch((err) => {
        console.log(err);
      });

    console.log(response);

    setMessages((prevMessages) => {
      const newBotMessage = {
        id: Date.now() + botName,
        sender: botName,
        message: <p>{response}</p>,
      };

      return [...prevMessages, newBotMessage];
    });
  };

  const onChangeHandler = (event) => {
    setInput(event.target.value);
  };

  const onInputKeyPressHandler = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      setMessages((prevValues) => {
        // Split inputs by line breaks
        const lines = input.split("\n");
        console.log(lines);

        const newMessage = {
          id: Date.now() + "user",
          sender: "user",
          message: lines.map((line, index) => (
            <p key={index}>
              {line}
              {index < lines.length - 1 && <br />}{" "}
              {/* Add <br> except for the last line */}
            </p>
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
