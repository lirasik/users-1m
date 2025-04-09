import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import "../components/MyComponents/styles.scss";
import userIcon from "../assets/user-icon.svg";

// Компонент для отображения списка пользователей
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
          key={users[index].id} // Убедитесь, что у каждого пользователя есть уникальный id
          className="user-item"
          style={{ ...style }}
          onClick={() => onSelect(users[index])} // Выбор пользователя для редактирования
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

// Компонент для отображения деталей пользователя
const UserDetails = ({ user, onSave, onDelete }) => {
  const [form, setForm] = useState(user);

  // Обновляем форму, если выбранный пользователь изменился
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
        <button
          onClick={() => onDelete(user.id)}
          style={{ marginLeft: "10px", background: "red" }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

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
      .then((data) => setUsers(data)) // Устанавливаем пользователей в состояние
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
      <button onClick={handleAddUser} style={{ marginBottom: "10px" }}>
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
