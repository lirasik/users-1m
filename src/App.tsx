import React, { useState, useEffect } from "react";
import "./components/MyComponents/styles.scss";

import UserList from "./components/MyComponents/UserList/UserList";
import UserDetails from "./components/MyComponents/UserDetails/UserDatails";

// Главный компонент приложения
const App = () => {
  const [users, setUsers] = useState<
    { id: number; name: string; surname: string; email: string; age: number }[]
  >([]); // Состояние для хранения списка пользователей
  const [selectedUser, setSelectedUser] = useState<{
    id?: number;
    name: string;
    surname: string;
    email: string;
    age: number;
  } | null>(null); // Состояние для хранения выделенного пользователя

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Получаем URL из .env

  // Загружаем пользователей с сервера при первом рендере
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки пользователей");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error("Ошибка загрузки пользователей:", error));
  }, []);

  // Сохранение пользователя (добавление или обновление)
  const handleSaveUser = (updatedUser: {
    id?: number;
    name: string;
    surname: string;
    email: string;
    age: number;
  }) => {
    if (!updatedUser.id) {
      fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при добавлении пользователя");
          }
          return response.json();
        })
        .then((newUser) => {
          setUsers((prevUsers) => [...prevUsers, newUser]);
          setSelectedUser(null);
        })
        .catch((error) =>
          console.error("Ошибка добавления пользователя:", error)
        );
    } else {
      fetch(`${API_BASE_URL}/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при обновлении пользователя");
          }
          return response.json();
        })
        .then((savedUser) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === savedUser.id ? savedUser : user
            )
          );
          setSelectedUser(null);
        })
        .catch((error) =>
          console.error("Ошибка сохранения пользователя:", error)
        );
    }
  };

  // Удаление пользователя
  const handleDeleteUser = (userId: number) => {
    fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при удалении пользователя");
        }
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setSelectedUser(null); // Сбрасываем выделенного пользователя
      })
      .catch((error) => console.error("Ошибка удаления пользователя:", error));
  };

  // Открытие формы для добавления нового пользователя
  const handleAddUser = () => {
    setSelectedUser({
      name: "",
      surname: "",
      email: "",
      age: 0,
    });
  };

  return (
    <div className="app-container">
      <button className="add-user" onClick={handleAddUser}>
        Добавить пользователя
      </button>
      <UserList
        users={users}
        onSelect={(user) => setSelectedUser(user)} // Передаём полный объект пользователя
      />
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default App;
