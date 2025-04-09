// filepath: /Users/antonsaverins/Documents/my trash/site/users-1m/user-editor/server/index.js
const express = require("express");
const { faker } = require("@faker-js/faker");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// Генерация пользователей
let users = [];
const generateUsers = (count) => {
  return Array.from({ length: count }, (_, id) => ({
    id,
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    email: faker.internet.email(),
  }));
};

// Создаём пользователей один раз
if (users.length === 0) {
  users = generateUsers(1000000);
}

// API для получения пользователей
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
