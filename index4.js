const form = document.querySelector(".grocery-form");
const alertElement = document.querySelector(".alert");
const grocery = document.querySelector(".form-control");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editFlag = false;
let editElement;
let editID = "";

window.addEventListener("DOMContentLoaded", setupItems);

// submit-button
submitBtn.addEventListener("click", addItems);
// clear-button
clearBtn.addEventListener("click", clearItems);

function addItems(e) {
  e.preventDefault();
  const value = grocery.value.trim();

  console.log(value);

  if (value && !editFlag) {
    const id = new Date().getTime().toString();
    createListItem(id, value);
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.querySelector(".p-3").textContent = value;
    editLocalStorage(editID, value);
    setBackToDefault();
  } else if (value === "") {
    // displayAlert("Enter Some Value", "danger");
    alert("enter some value");
  }
}

function displayAlert(message, type) {
  // Create an alert element
  const alertElement = document.createElement("div");
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;

  // Add the alert element to the page
  document.body.appendChild(alertElement);

  // Set a timeout to remove the alert after a few seconds
  setTimeout(() => {
    alertElement.remove();
  }, 3000); // Remove the alert after 3 seconds (adjust the time as needed)
}


function clearItems() {
  const items = document.querySelectorAll(".grocery-items");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  clearBtn.classList.remove("show-container");
  removeFromLocalStorage();
  setBackToDefault();
}

function deleteAction(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    clearBtn.classList.remove("show-container");
  }
  removeFromLocalStorage(id);
  setBackToDefault();
}

function editAction(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = element.querySelector(".p-3");
  const value = editElement.textContent;
  grocery.value = value;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function addToLocalStorage(id, value) {
  const grocery = { id: id, value: value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  if (id) {
    items = items.filter(function (item) {
      return item.id !== id;
    });
  }
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-items");
  element.setAttribute("data-id", id);
  element.innerHTML = `
    <div class="p-3">${value}</div>
    <div class="col item">
      <button type="button" class="btn btn-light edit">edit</button>
      <button type="button" class="btn btn-light bin">bin</button>
    </div>`;

  clearBtn.classList.add("show-container");

  // Add list item to the parent class
  list.appendChild(element);

  // Delete button
  const deleteBtn = element.querySelector(".bin");

  // Delete action
  deleteBtn.addEventListener("click", deleteAction);

  const editBtn = element.querySelector(".edit");

  // Edit action
  editBtn.addEventListener("click", editAction);
}
