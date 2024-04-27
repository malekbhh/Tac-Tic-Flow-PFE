import React, { useEffect, useRef, useState } from "react";
import { Input, Avatar, Empty } from "antd";
import "./Messanger.css";
import ChatUser from "../../components/organism/ChatUser";
import MessageBox from "../../components/organism/MessageBox";
import Message from "../../components/organism/Message";
import axiosClient from "../../axios-client";
import { UserOutlined } from "@ant-design/icons"; // Import de l'icône utilisateur par défaut
import pic from "../../assets/file.png";
import send from "../../assets/send.png";
const Messenger = ({ user }) => {
  const containerRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get("/user1");
        setAuth(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      const response = await axiosClient.get(`/user-messages/${user.id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <>
      <div className="chatContainer  w-full bg-white ml-11 bg-opacity-30 dark:bg-black dark:bg-opacity-30 ">
        <div className="chatUserList">
          <Input
            className="bg-white bg-opacity-60"
            placeholder="Search User"
            allowClear
          />
          <div>
            <ChatUser user={user} onUserSelect={handleUserSelect} />
          </div>
        </div>

        <div className="chatBody">
          <div className="chatHeader">
            <div className="chat-title">
              {selectedUser ? (
                <>
                  <Avatar
                    src={selectedUser.avatar ? selectedUser.avatar : undefined}
                    icon={<UserOutlined />}
                  />
                  <span className="dark:text-gray-300">
                    {" "}
                    {selectedUser?.name}
                  </span>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="messages rounded-lg">
            {selectedUser ? (
              messages?.map((item) => (
                <Message
                  key={item?.id}
                  align={item?.from === selectedUser.id ? "left" : "right"}
                  message={item?.message}
                  createdAt={item?.created_at}
                  user={selectedUser}
                  currentUser={auth}
                ></Message>
              ))
            ) : (
              <div className="empty">
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{ height: 100 }}
                  description={
                    <span className="dark:text-white ">
                      No user <a href="#API">selected</a>
                    </span>
                  }
                />
              </div>
            )}
            <div ref={containerRef}></div>
          </div>
          <div className="messageBox  flex gap-1   w-full">
            <button className="bg-white m-2 bg-opacity-45 pl-3 pr-1 rounded-lg">
              <img src={pic} alt="icon" />
            </button>
            <MessageBox
              messages={messages}
              setMessages={setMessages}
              selected={selectedUser ? selectedUser.id : null}
              userId={auth && auth.id}
            />
            <button className="bg-indigo-400  px-2  rounded-lg m-2">
              <img src={send} alt="icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
