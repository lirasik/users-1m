import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker/locale/en";
import "../components/MyComponents/styles.scss";
import userIcon from "../assets/user-icon.svg";

const generateUsers = (count) => {
  return Array.from({ length: count }, (_, id) => ({
    id,
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    email: faker.internet.email(),
  }));
};

const userSlice = createSlice({
  name: "users",
  initialState: generateUsers(1000000),
  reducers: {
    updateUser: (state, action) => {
      const index = state.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
  },
});

const store = configureStore({ reducer: { users: userSlice.reducer } });

const UserList = ({ onSelect }) => {
  const users = useSelector((state) => state.users);

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
  const dispatch = useDispatch();

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
        <label>Возвраст</label>
        <input
          type="text"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <button
          onClick={() => {
            dispatch(userSlice.actions.updateUser(form));
            onSave();
          }}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Provider store={store}>
      <div className="app-container">
        <UserList onSelect={setSelectedUser} />
        {selectedUser && (
          <UserDetails
            user={selectedUser}
            onSave={() => setSelectedUser(null)}
          />
        )}
      </div>
    </Provider>
  );
};

export default App;
