import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Divider, List, Skeleton } from "antd";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons"; // Import de l'icône utilisateur

const ChatUser = ({ user, onUserSelect }) => {
  const [total, setTotal] = useState(100);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const getUsers = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setPage(page + 1);
    axiosClient
      .get(`/chat-users?page=${page}`)
      .then(async (res) => {
        setTotal(res.data.total);
        setHasMore(false);

        // Récupération des avatars pour chaque utilisateur
        const userAvatars = await Promise.all(
          res.data.data.map(async (user) => {
            try {
              const avatarResponse = await axiosClient.get(`/user1/${user.id}`);
              return {
                ...user,
                avatar: avatarResponse.data.avatar
                  ? avatarResponse.data.avatar
                  : null,
              };
            } catch (error) {
              console.error("Error fetching user avatar:", error);
              return user; // Utiliser les données de l'utilisateur sans avatar en cas d'erreur
            }
          })
        );

        setData([...data, ...userAvatars]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  const goto = () => {};
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div
      id="scrollableDiv"
      style={{
        height: 630,
        overflow: "auto",
        padding: "0px 0px",
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={getUsers}
        hasMore={hasMore}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={
          <Divider plain>
            <span className="dark:text-gray-400">It is all, nothing more</span>{" "}
            🤐
          </Divider>
        }
        scrollableTarget="scrollableDiv"
      >
        {data && (
          <List
            className="text-white"
            dataSource={data}
            renderItem={(item, index) => (
              <div
                onClick={() => onUserSelect(item)} // Appel de la fonction onUserSelect avec l'utilisateur sélectionné
              >
                <Link className="dark:text-gray-300" to={`/chat/${item.id}`}>
                  {" "}
                  {/* Utilisation de Link avec l'URL spécifiée */}
                  <List.Item
                    style={{ padding: "10px", gap: "0px" }}
                    className={user?.id == item.id ? "selected" : ""}
                    key={index}
                    onClick={goto}
                  >
                    <List.Item.Meta
                      avatar={
                        item.avatar ? (
                          <Avatar src={item.avatar} />
                        ) : (
                          <Avatar icon={<UserOutlined />} />
                        )
                      }
                      title={
                        <span className="dark:text-gray-300 user-name">
                          {item?.name}
                        </span>
                      }
                    />
                  </List.Item>
                </Link>
              </div>
            )}
          />
        )}
      </InfiniteScroll>
    </div>
  );
};

export default ChatUser;
