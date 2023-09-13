// Сохранили API пользователей
let API = "http://localhost:8000/users";

// Вытащили элементы из HTML
let btnsLog = document.querySelector(".btnsLog");
let btnRegister = document.querySelector("#submit");
let btnLogIn = document.querySelector("#LogIn");
let btnLogOut = document.querySelector("#logout");
let usernameLogIn = document.querySelector("#usernameSignIn");
let username = document.querySelector("#username");
let passwordLogIn = document.querySelector("#passwordSignIn");
let password = document.querySelector("#password");
let start = document.querySelector("#start");

// Навесили событие на кнопку регистрации(сохранение данных пользователя в db.json)

btnRegister.addEventListener("click", () => {
  Register();
});

// Создали функцию которая будет регистрировать нашего пользователя
async function Register() {
  // если поля не заполнены останавливаем код
  if (!username.value || !password.value) {
    alert("Введите Данные");
    return;
  }
  // Создаем новый обьект со значениями имя пользователя и пароль
  let user = {
    username: username.value,
    password: password.value,
  };
  // Получаем данные с db.json
  let users = await fetch(API);
  // Распаковка PROMISE
  let data = await users.json();
  console.log(data);
  // Флаг для проверки, чтобы цикл остановился во время
  let flag = false;
  // с помощью цикла forEach разбираем обьекты с данными о пользователей
  data.forEach((item) => {
    // если обьект с именем нашего пользователя уже существует
    if (item.username == user.username) {
      // меняем значение нашего флага и останавливаем код
      flag = true;
      alert("Акканун с таким именем уже существует");
      return;
    }
  });
  // если значение флага все еще false т.е.
  // если в нашей базе нет пользователья с таким же именем(username)
  // регистрируем пользователя т.е. отправляем данные в db.json
  if (!flag) {
    await fetch(API, {
      // fetch по умолчанию получает данные с db.jsone=>
      // => указывем мметод POST, чтобы  ОТПРАВИТЬ данные
      method: "POST",
      // обьязатнльно добавляем содержимое наших данных(body),
      //  и с помощью JSON.stryngify() превращаем обьект в строку,
      body: JSON.stringify(user),
      // указывем что именно мы отправляем(описание)
      headers: {
        "Content-type": "application/json",
      },
    });
    // уведомляем пользователя что он прошел рег
    alert("Вы успешно прошли регистрацию");
    return;
  }
}

// навешиваем событие на кнопку Login
btnLogIn.addEventListener("click", () => {
  login();
});
// функция для логина
async function login() {
  // если поля не заполнены останавливаем код
  if (!usernameLogIn.value || !passwordLogIn.value) {
    alert("Введите Данные");
    return;
  }
  // создаем обьект с введенными данными пользователья
  let user = {
    username: usernameLogIn.value,
    password: passwordLogIn.value,
  };
  // получаем даннные с db.json(пользователей)
  let data = await fetch(API);
  // распаковка данных
  let res = await data.json();
  // создаем флаг со значением false
  let flag = false;
  // разбираем данные о пользователей
  res.forEach((item) => {
    // если есть совпадение с введенными данными пользователя (пользователь заполнил инпуты)
    if (item.username == user.username && item.password == user.password) {
      alert("Добро Пожаловать ");
      // меняем значение нашего флага
      flag = true;
      // сохраняем пользователя в LS
      localStorage.setItem("users", user.username);
      // Останавливаем код
      return;
    }
  });
  // если флаг все еще false,т.е. мы не меняли его значение ранее
  // значит  пользователя с такими данными не существует
  if (!flag) {
    alert("Аккаунт не найден");
    // освобождаем инпуты
    usernameLogIn.value = "";
    passwordLogIn.value = "";
    return;
  }
  // функция которая будет показывать фон в зависимости от статуса пользователя
  // если он зашел в свой аккаунт показывает карточки и навбар
  //  а если вышел кнопки регистрации и логина
  checkUser();
  // т.к он зашел в свой аккаунт откроется страничка с карточками
}

// навешиваем событие на кнопку logout
btnLogOut.addEventListener("click", () => {
  Logout();
});
function Logout() {
  // получаем данные о пользователя с LS
  let users = localStorage.getItem("users");
  // если в LS существуют такие данные
  // вызываем ф-ию сheckUser которая будет менять содержимое страницы
  // т.к пользователь вышел появятся кнопки Регистрации и Логина
  if (users) {
    checkUser();
    // удаляем данные о пользователя с локалстор
    localStorage.removeItem("users");
  }
}
// сама ф-я checkUsre
function checkUser() {
  // получаем данные c localStorage
  let users = localStorage.getItem("users");
  // если  там находится данные нашего пользователя
  // показываем фон с карточками и убираем кнопки РЕГ и ЛОГ
  // или наоборт
  if (users) {
    btnsLog.classList.toggle("d-none");
    start.classList.toggle("d-none");
  }
}
