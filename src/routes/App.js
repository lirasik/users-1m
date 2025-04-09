import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import "../components/MyComponents/styles.scss";
import userIcon from "../assets/user-icon.svg";

const UserList = ({ users, onSelect }) => {
  return (
    <List
      height={500}
      width={300}
      itemSize={50}
      itemCount={users.length}
      className="user-list"
    >
      {({ index, style }) => (
        <div
          key={users[index].id}
          className="user-item"
          style={{ ...style }}
          onClick={() => onSelect(users[index])}
        >
          <img src={userIcon} alt="User Icon" />
          <p style={{ margin: 0 }}>
            {users[index].name} {users[index].surname}
          </p>
        </div>
      )}
    </List>
  );
};

const UserDetails = ({ user, onSave }) => {
  const [form, setForm] = useState(user);

  useEffect(() => setForm(user), [user]);

  return (
    <div className="user-details">
      <img src={userIcon} alt="User Icon" />
      <div>
        <div className="fullName">
          <div className="name">
            <label>Имя</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="surname">
            <label>Фамилия</label>
            <input
              type="text"
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
            />
          </div>
        </div>
        <label>Почта</label>
        <input
          type="text"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label>Возраст</label>
        <input
          type="text"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <button onClick={() => onSave(form)}>Сохранить</button>
      </div>
    </div>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Запрос к серверу для получения пользователей
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Ошибка загрузки пользователей:", error));
  }, []);

  const handleSaveUser = (updatedUser) => {
    // Если пользователь новый (не имеет id), добавляем его
    if (!updatedUser.id) {
      const newUser = { ...updatedUser, id: Date.now() }; // Генерируем уникальный id
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } else {
      // Отправляем обновлённые данные на сервер
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
          // Обновляем пользователя в состоянии
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === savedUser.id ? savedUser : user
            )
          );
        })
        .catch((error) =>
          console.error("Ошибка сохранения пользователя:", error)
        );
    }
    setSelectedUser(null); // Закрываем форму после сохранения
  };

  const handleAddUser = () => {
    // Открываем форму для добавления нового пользователя
    setSelectedUser({
      name: "",
      surname: "",
      email: "",
      age: "",
    });
  };

  return (
    <div className="app-container">
      <button onClick={handleAddUser} style={{ marginBottom: "10px" }}>
        Добавить пользователя
      </button>
      <UserList users={users} onSelect={setSelectedUser} />
      {selectedUser && (
        <UserDetails user={selectedUser} onSave={handleSaveUser} />
      )}
    </div>
  );
};

export default App;
