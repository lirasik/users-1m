const express = require("express");
const { faker } = require("@faker-js/faker");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Для обработки JSON в теле запроса

// Генерация пользователей
let users = [];
const generateUsers = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1, // Начинаем с 1
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    email: faker.internet.email(),
  }));
};

// Создаём пользователей один раз
if (users.length === 0) {
  users = generateUsers(10); // Генерируем 10 пользователей
}

// API для получения пользователей
app.get("/api/users", (req, res) => {
  res.json(users); // Возвращаем массив пользователей в формате JSON
});

// Обновление пользователя
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUser = req.body;

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: "Пользователь не найден" });
  }
});

// Добавление нового пользователя
const { v4: uuidv4 } = require("uuid");

app.post("/api/users", (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1; // Присваиваем новый ID, начиная с 1
  users.push(newUser);
  console.log("Пользователь добавлен на сервере:", newUser);
  res.status(201).json(newUser);
});

// Удаление пользователя
app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1); // Удаляем пользователя из массива
    res.status(200).json({ message: "Пользователь удалён" });
  } else {
    res.status(404).json({ message: "Пользователь не найден" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
