import React from "react";
import { FixedSizeList as List } from "react-window";
import "../styles.scss"; // Подключаем стили
import userIcon from "../../../assets/user-icon.svg"; // Импортируем иконку

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  age: number;
}

interface UserListProps {
  users: User[];
  onSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onSelect }) => {
  return (
    <List
      height={500} // Высота видимой области списка
      itemCount={users.length} // Количество элементов
      itemSize={50} // Высота одного элемента
      width={"500px"} // Ширина списка
    >
      {({ index, style }) => (
        <div
          style={style} // Стили для позиционирования элемента
          className="user-item"
          onClick={() => onSelect(users[index])}
        >
          <img src={userIcon} alt="User Icon" className="user-icon" />
          <span className="user-name">
            {users[index].name} {users[index].surname}
          </span>
        </div>
      )}
    </List>
  );
};

export default UserList;
