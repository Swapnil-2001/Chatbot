import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { SendOutlined } from "@ant-design/icons";

import sampleResponses from "../data/sampleResponses.json";

const defaultBotResponse = "Sorry, I cannot answer that.";

const Chatbot = ({ endpoint, decoverId }) => {
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState({ text: "", isSentByBot: true });
  const [listOfMessages, setListOfMessages] = useState([]);

  useEffect(() => {
    scrollToBottom();
  }, [listOfMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = (event) => {
    const { value: message } = event.target;
    setNewMessage({ text: message, isSentByBot: false });
  };

  const sendMessage = (message) => {
    const { text } = message;
    if (text.trim().length === 0) return;

    setListOfMessages((prevListOfMessages) => [...prevListOfMessages, message]);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setListOfMessages((prevListOfMessages) => [
          ...prevListOfMessages,
          { text: response.message, isSentByBot: true },
        ]);
      }
    };

    // xhr.send(
    //   JSON.stringify({
    //     "decover-id": decoverId,
    //     query: text,
    //     context: listOfMessages,
    //   })
    // );

    const sampleResponse =
      text in sampleResponses ? sampleResponses[text] : defaultBotResponse;

    setListOfMessages((prevListOfMessages) => [
      ...prevListOfMessages,
      { text: sampleResponse, isSentByBot: true },
    ]);

    setNewMessage({ text: "", isSentByBot: true });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    sendMessage(newMessage);
  };

  const isNewMessageEmpty = () => newMessage.text.trim().length === 0;

  return (
    <ChatbotContainer>
      <ListOfMessagesContainer>
        {listOfMessages?.map((message, index) =>
          message.isSentByBot ? (
            <MessageSentByBot key={index}>{message.text}</MessageSentByBot>
          ) : (
            <MessageSentByUser key={index}>{message.text}</MessageSentByUser>
          )
        )}
        <div ref={messagesEndRef} />
      </ListOfMessagesContainer>
      <SendMessageForm onSubmit={handleFormSubmit}>
        <MessageInputContainer
          type="text"
          value={newMessage.text}
          placeholder="Ask something..."
          onChange={handleNewMessage}
          autoComplete="off"
        />
        <MessageSubmitButton type="submit" disabled={isNewMessageEmpty()}>
          <SendOutlined
            style={{
              fontSize: "20px",
              color: !isNewMessageEmpty() ? "#3E54AC" : "#BDCDD6",
            }}
          />
        </MessageSubmitButton>
      </SendMessageForm>
    </ChatbotContainer>
  );
};

const ChatbotContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 350px;
  height: 400px;
  margin-right: 35px;
  margin-bottom: 35px;
  border-radius: 25px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const ListOfMessagesContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MessageSentByBot = styled.div`
  display: inline-block;
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 15px;
  max-width: 200px;
`;

const MessageSentByUser = styled.div`
  display: inline-block;
  margin-left: auto;
  background-color: #3e54ac;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 15px;
  max-width: 200px;
`;

const SendMessageForm = styled.form`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 15px 0;
  height: 45px;
`;

const MessageInputContainer = styled.input`
  border: none;
  margin-left: 20px;
  outline: none;
  width: 260px;
`;

const MessageSubmitButton = styled.button`
  display: flex;
  justify-content: center;
  margin: 0 10px;
  float: right;
  border: none;
  background-color: white;
  cursor: pointer;
`;

export default Chatbot;
