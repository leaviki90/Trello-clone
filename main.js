const boardsContainer = document.getElementById("boardsContainer");
const addBoard = document.querySelector(".add-board");

boardsContainer.addEventListener("dragstart", (e) => {
  const listI = e.target.closest(".list-item");
  if (listI) {
    listI.classList.add("dragging");
  }
});

boardsContainer.addEventListener("dragend", (e) => {
  const listI = e.target.closest(".list-item");
  if (listI) {
    listI.classList.remove("dragging");
  }
});

boardsContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const listP = e.target.closest(".list");
  if (listP) {
    const afterElement = getDragAfterElement(listP, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == 0) {
      listP.appendChild(draggable);
    } else {
      listP.insertBefore(draggable, afterElement);
    }
  }
});

boardsContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const listP = e.target.closest(".list");
  if (listP) {
    createData();
  }
});

function getDragAfterElement(list, y) {
  const draggableElements = [
    ...list.querySelectorAll(".list-item:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();

      const offset = y - box.top - box.height / 2;
      // console.log(offset);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

boardsContainer.addEventListener("click", (e) => {
  const addBtnParent = e.target.closest(".add-btn");
  const cancelBtnParent = e.target.closest(".cancel-item-btn");
  const addItemBtnParent = e.target.closest(".add-item-btn");
  const delCardBtnParent = e.target.closest(".del-card-btn");

  const boardsItem = e.target.closest(".boards-item");

  if (boardsItem) {
    const textarea = boardsItem.querySelector(".textarea");
    const form = boardsItem.querySelector(".form");
    const btn = boardsItem.querySelector(".add-btn");
    const itemBtn = boardsItem.querySelector(".add-item-btn");
    const currentList = boardsItem.querySelector(".list");

    if (addBtnParent) {
      form.style.display = "block";
      btn.style.display = "none";
      itemBtn.style.display = "none";
    }

    if (cancelBtnParent) {
      textarea.value = "";
      value = "";
      form.style.display = "none";
      btn.style.display = "flex";
    }

    if (addItemBtnParent) {
      const newItem = document.createElement("div");
      newItem.classList.add("list-item");
      newItem.draggable = true;
      newItem.textContent = textarea.value;
      currentList.append(newItem);
      textarea.value = "";
      value = "";
      form.style.display = "none";
      btn.style.display = "flex";
      createData();
    }

    if (delCardBtnParent) {
      boardsItem.remove();
      createData();
    }
  }
});

boardsContainer.addEventListener("dblclick", (e) => {
  const listItemParent = e.target.closest(".list-item");

  if (listItemParent) {
    listItemParent.remove();
    createData();
  }
});

boardsContainer.addEventListener("input", (e) => {
  const textAreaMain = e.target.closest("textarea");
  const titleSpan = e.target.closest(".title");

  if (textAreaMain) {
    const addBtn = textAreaMain
      .closest(".boards-item")
      .querySelector(".add-item-btn");
    let value;

    value = textAreaMain.value;
    if (value) {
      addBtn.style.display = "block";
    } else {
      addBtn.style.display = "none";
    }
  }

  if (titleSpan) {
    createData();
  }
});

function addBoardd() {
  const boards = document.querySelector(".boards");
  const board = document.createElement("div");
  board.classList.add("boards-item");
  board.innerHTML = `<div class="title-container">
  <span class="title" contenteditable="true">Enter a title</span>
  <span class="del-card-btn">X</span>
  </div>
  <div class="list">
  </div>
  <div class="form">
      <textarea class="textarea" placeholder="Enter a card name"></textarea>
      <div class="buttons">
          <button class="add-item-btn">Add</button>
          <button class="cancel-item-btn">Cancel</button>
      </div>
  </div>
  <div class="add-btn"><span> + </span>Add a card</div>
  `;
  boards.append(board);
  // changeTitle();
  createData();
}

addBoard.addEventListener("click", addBoardd);

function changeTitle() {
  const titles = document.querySelectorAll(".title");
  titles.forEach((title) => {
    title.addEventListener("click", (e) => (e.target.textContent = ""));
  });
}

const data = [];

function createData() {
  data.length = 0;
  const boards = document.querySelectorAll(".boards-item");
  boards.forEach((board, index) => {
    const title = board.querySelector(".title").textContent;
    const listItems = board.querySelectorAll(".list-item");
    const listItemContent = [];
    listItems.forEach((item) => {
      return listItemContent.push(item.textContent);
    });
    data.push({ index: index, title: title, items: listItemContent });
  });

  console.log(data);
  writeToStorage(data);
}

// Test IF LocalStorage is accessible
function isTest() {
  let test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function writeToStorage(data) {
  if (isTest() === true) {
    localStorage.setItem("data", JSON.stringify(data));
  }
}
