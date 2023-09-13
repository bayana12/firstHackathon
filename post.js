// сохраняем АПИ с данными posts
let API_P = "http://localhost:8000/posts";

// Вытаскиваем нужные  элементы с НТМL
let city = document.querySelector("#city");
let country = document.querySelector("#country");
let img = document.querySelector("#image");
let descr = document.querySelector("#descr");
let btnAdd = document.querySelector("#btn-save");

// пустой див для добавления карточек
let list = document.querySelector("#post-list");

let inpEditCity = document.querySelector("#cityEdit");
let inpEditCountry = document.querySelector("#countryEdit");
let inpEditDescr = document.querySelector("#descrEdit");
let inpEditImage = document.querySelector("#imageEdit");
let btnSave = document.querySelector("#btn-edit-save");

// инпут поиск
let searchInp = document.querySelector("#search");
// новоя переменная с пустой строкой
let searchVal = "";
// console.log((inpEditCity.value = "sd"));

// пустой массив для нумераций страниц
// будем добавлять номера страниц
let paginationList = document.querySelector(".pagination-list");
// кнопка след
let prev = document.querySelector("#prev");
// кнопка назад
let next = document.querySelector("#next");
// страница на которой  находится пользователь
let currentPage = 1;
// общ. колличество страниц
// пока неизвестно, будет менятся в зависимости от кол-ва карточек и лимита
let pageTotalCount = null;
// сколько карточек может быть на одной странице
const limit = 3;

// навешиаем событие на кнопку добавления карточек
btnAdd.addEventListener("click", () => {
  // сохраняем данные введенные пользователем
  let cityVal = city.value;
  let countryVal = country.value;
  let imgVal = img.value;
  let descrVal = descr.value;
  // если есть незаполненные останавливаем код
  if (!cityVal || !countryVal || !imgVal || !descrVal) {
    alert("Заполните поля");
    return;
  }
  // создаем обьект с введенными данными
  let post = {
    city: cityVal,
    country: countryVal,
    img: imgVal,
    descr: descrVal,
  };
  // отправляем этот обьект в базу данных
  fetch(API_P, {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-type": "application/json",
    },
  });
  // рисуем карточку на странице
  render();
});

// ф-я которая будет рисовать карточки
async function render() {
  // очищаем дивку
  // чтобы предыдущие карточки не повторялись
  list.innerHTML = "";
  // запрашиваем данные с дб
  // данные со значениями введенные  в инпут поиска,
  // страничку на которой находится пользователь и указываем лимит карточек
  let res = await fetch(
    `${API_P}?q=${searchVal}&_page=${currentPage}&_limit=${limit}`
  );
  // общ.кол-во карточек
  // как мы знаем в header находиться описание запрашеваемых данных,
  // получаем общ.кол-во постов
  let count = res.headers.get("x-total-count");
  // общ.кол-во страниц=общ.кол-во карточек/лимит
  pageTotalCount = Math.ceil(count / limit);
  // распаковка
  let data = await res.json();
  // с помощью цикла обращаемся к каждому посту(обьекту)
  data.forEach((item) => {
    console.log(item);
    // добавляем в пусой див нарисованные карточки
    list.innerHTML += `
  <div id="products-list" class="d-flex flex-wrap justify-content-center mt-5">
  <div class="card" style="width: 18rem">
    <img src="${item.img}" class="card-img-top" alt="..." height="200px" />
    <div class="card-body">
      <h5 class="card-city">${item.city}</h5>

      <h6>${item.country}</h6>

      <p class="card-text" id=${item.id}>${item.descr.slice(0, 70)}</p>

      <div class="dropdown">
        <button
          class="btn btn-white dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src="./assets/menu.svg" />
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item btn-del"  
          id=${item.id} href="#">Удалить</a></li>
          <li>
            <a
              class="dropdown-item btn-edit"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
              id=${item.id}
              >Изменить</a
            >
          </li>
         
        </ul>
      </div>
    </div>
  </div>
</div>
        `;
  });
  // рисуем pagination снизу
  renderPagination();
}
// рисуем карточки
render();

// навешиваем событие сlick на весь document
document.addEventListener("click", async (e) => {
  // ! DELETE
  // если у элемент на которого мы кикнули есть  класс btn-del
  // удаляем карточку(по id находим нужную карточку,
  //  когда рисовали карточки каждому задавали id обьекта(поста))
  if (e.target.classList.contains("btn-del")) {
    await fetch(`${API_P}/${e.target.id}`, {
      method: "DELETE",
    });
    // заново рисуем карточки без удаленной карточки
    render();
  }
  // ? EDIT
  // если у элемент на которого мы кикнули есть  класс btn-edit
  // заполняем содержиое инпутов (находим по Id карточку которую хотим изм)
  if (e.target.classList.contains("btn-edit")) {
    let res = await fetch(`${API_P}/${e.target.id}`);
    let data = await res.json();

    inpEditCountry.value = data.country;
    inpEditCity.value = data.city;
    inpEditDescr.value = data.descr;
    inpEditImage.value = data.img;
    btnSave.id = data.id;
    render();
  }
  // * DESCRIPTION
  // при  клике на описание выводит полное описание
  if (e.target.classList.contains("card-text")) {
    let res = await fetch(`${API_P}/${e.target.id}`);
    let data = await res.json();
    alert(data.descr);
  }
});

// навешиваем событие клик на кнопку сохранения изменений
btnSave.addEventListener("click", async (e) => {
  let cityVal = inpEditCity.value;
  let countryVal = inpEditCountry.value;
  let descrVal = inpEditDescr.value;
  let imageVal = inpEditImage.value;
  // если есть пустой инпут останавливаем код
  if (!cityVal || !countryVal || !descrVal || !imageVal) {
    return;
  }
  // создаем  обьект с измененными данными
  let obj = {
    city: cityVal,
    country: countryVal,
    descr: descrVal,
    img: imageVal,
  };
  // отправляем данные в db
  await fetch(`${API_P}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => {
    // делаем код асинхронным

    render();
  });
});

// навеживаем событие на инпут которое будет сохранять значени инпута в searchVal
// searchVal находится в ф-ии render, в зависимости от ее значение будут рисоваться карточки которые имеют в описани значение searchVal
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  // console.log(searchVal);
  render();
});

function renderPagination() {
  // очищаем лист с нумерациями страничек
  paginationList.innerHTML = "";
  // с помощью цикла рисуем нумерацию страниц
  // от 1 до общ.кол-ва страниц
  // если номер страницы совпадает со страницой на которой находится пользователь,
  // добавляем класс актив=> который меняет цвет кнопки на синий
  for (let i = 1; i <= pageTotalCount; i++) {
    paginationList.innerHTML += `
      <li class="page-item ${currentPage == i ? "active" : ""}">
        <a class="page-link page_number">${i}</a>
      </li>
    `;
  }

  // логика для кнопок назад и вперед
  if (currentPage == 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
  }

  if (currentPage == pageTotalCount) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
}

// навешиваем события на кнопки назад и вперед
// при клиике будет увеличивать или уменьшать  на 1
// нумерацию страницы на которой находится пользователь
prev.addEventListener("click", () => {
  if (currentPage == 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage == pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

// логика для перехода на определенную страницу
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.textContent;
    render();
  }
});
