import React, { useState, useEffect } from "react";
import { Input } from "antd";
import axiosClient from "../../axios-client";
import Pusher from "pusher-js";

const { TextArea } = Input;

const MessageBox = ({ selected, setMessages, userId }) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (userId) {
      const pusher = new Pusher("5d19fbc4e019d389965e", {
        cluster: "eu",
      });
      const chatChannel = pusher.subscribe("chat." + userId);
      chatChannel.bind("MessageSent", (messageData) => {
        setMessages((anciensMessages) => [...anciensMessages, messageData]);
      });
    }
  }, [userId]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      axiosClient
        .post("/send/message", {
          message: message,
          receiver_id: selected,
        })
        .then((res) => {
          setMessages((prevItems) => [...prevItems, res.data.message]);
        })

        .catch((error) => {
          console.log(error?.response?.data?.message);
        });
      setMessage("");
    }
  };
  return (
    <div className="w-full ">
      <TextArea
        className=" bg-white bg-opacity-45 rounded-lg"
        rows={2}
        disabled={!selected}
        placeholder="Type your message and hit enter...."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default MessageBox;
