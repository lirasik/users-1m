import React from "react";
import { FixedSizeList as List } from "react-window";
import userIcon from "../../../assets/user-icon.svg";
import "../styles.scss"; // Подключаем стили, если нужно
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

export default UserList;
