import React, { useState, useEffect } from "react";
import userIcon from "../../../assets/user-icon.svg";
import "../styles.scss"; // Подключаем стили, если нужно

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

export default UserDetails;
