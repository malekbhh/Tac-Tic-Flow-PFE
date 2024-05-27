import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Message = ({ align, message, createdAt, user }) => {
  const formatMessageDate = (createdAt) => {
    const messageDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return "Hier";
    } else {
      return messageDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const formattedDate = formatMessageDate(createdAt);

  return (
    <div className={align}>
      <div className="message-content">
        {align === "left" && (
          <div className="flex ">
            <div className="message-avatar">
              {user.avatar ? (
                <Avatar src={user.avatar} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </div>
            <div className="gap-1 flex flex-col">
              <div
                className=" rounded-2xl bg-midnightblue text-white py-1 px-3 max-w-96"
                style={{ fontSize: "small" }}
              >
                {message}
              </div>
              <div className="justify-start pl-1 flex text-xs text-gray-600">
                {formattedDate}
              </div>
            </div>
          </div>
        )}
        {align === "right" && (
          <div className="gap-1 flex flex-col">
            <div
              className="rounded-2xl bg-white py-1 px-3 max-w-96"
              style={{ fontSize: "small" }}
            >
              {message}
            </div>
            <div className="justify-end pr-1 flex text-xs text-gray-600">
              {formattedDate}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
