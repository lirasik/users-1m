import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import "./components/MyComponents/styles.scss";

import UserList from "./components/MyComponents/UserList/UserList.jsx";

import UserDetails from "./components/MyComponents/UserDetails/UserDatails.jsx";

// Главный компонент приложения
const App = () => {
  const [users, setUsers] = useState([]); // Состояние для хранения списка пользователей
  const [selectedUser, setSelectedUser] = useState(null); // Состояние для выбранного пользователя

  // Загружаем пользователей с сервера при первом рендере
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
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
  const handleSaveUser = (updatedUser) => {
    if (!updatedUser.id) {
      fetch("http://localhost:5000/api/users", {
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
      fetch(`http://localhost:5000/api/users/${updatedUser.id}`, {
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
  const handleDeleteUser = (userId) => {
    fetch(`http://localhost:5000/api/users/${userId}`, {
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
      age: "",
    });
  };

  return (
    <div className="app-container">
      <button className="add-user" onClick={handleAddUser}>
        Добавить пользователя
      </button>
      <UserList users={users} onSelect={setSelectedUser} />
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
