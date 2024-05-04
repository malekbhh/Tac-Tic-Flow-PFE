import React, { useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Pusher from "pusher-js";
import { Badge, List } from "antd";
import { BellOutlined } from "@ant-design/icons";
const NotificationComponent = () => {
  const { user, notifications, setUser, setNotifications } = useStateContext();
  const { unreadNotifications, setUnreadNotifications } = useStateContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosClient.get("/notifications");
        setNotifications(response.data.notifications);

        console.log(user);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    Pusher.logToConsole = true;
    const pusher = new Pusher("cb9e28174a3601ab1cff", {
      cluster: "eu",
      encrypted: true,
    });
    const channel = pusher.subscribe(`notification.${user.id}`);

    channel.bind("NotificationSent", function (data) {
      // Mettre à jour l'état des notifications lorsque de nouvelles notifications sont reçues
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
      setUnreadNotifications(
        (prevUnreadNotifications) => prevUnreadNotifications + 1
      );
      setUser((prevUser) => ({
        ...prevUser,
        unreadNotifications: unreadNotifications,
      }));
    });

    // Nettoyer l'abonnement Pusher lors du démontage du composant
    return () => {
      channel.unbind("NotificationSent");
      pusher.unsubscribe(`notification.${user.id}`);
    };
  }, [user.id, setNotifications, , setUnreadNotifications]);

  return (
    //     <div>
    //       <h2>Notifications</h2>
    //       <ul>
    //         {notifications.map((notification, index) => (
    //           <li key={index}>{notification.notification}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   );
    // };

    // export default NotificationComponent;

    <div className="my-3">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      <List
        className="max-h-48  overflow-y-auto"
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(notification) => (
          // <List.Item className="py-2 border-b border-gray-300 flex items-center">
          //   <Badge count={unreadNotifications} offset={[10, 0]}>
          //     <BellOutlined className="mr-2" />
          //   </Badge>{" "}
          //   <span className="text-sm">{notification.notification}</span>
          // </List.Item>
          <List.Item className="py-2 border-b border-gray-300 flex justify-between items-center">
            <span className="text-sm">{notification.notification}</span>
            <Badge count={unreadNotifications} offset={[10, 0]}>
              <BellOutlined />
            </Badge>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationComponent;
