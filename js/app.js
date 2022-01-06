// set URL  of the quiz
let url = "https://quizapi.io/api/v1/questions?";

// set the API_KEY
const API_KEY = "rzo49ylLxsSfhVGkYu0cJOeSRRK5JS7A1Dp80RDw";

// get the Name of the language from URL
let nameOfLanguage = window.location.hash.slice(1);

// get element showQuestions
let showQuestions = document.querySelector(".show-questions");

// get button Start
let btnNext = document.querySelector(".next");

// set index
let i = 0;
// counter
let count = 0;
//set pointer
let points = 0;

//add Evenet click
btnNext.addEventListener("click", function (params) {
  // triger function next()
  next();
});

// check the url do not have hash
if (window.location.href.indexOf("#") != -1) {
  getData();
} else {
  // show message
  let notFound = `<div class='not-found'> <h1> Note Found </h1> </div>`;
  document.body.innerHTML = notFound;
}

// asynchron function
async function getData(params) {
  try {
    // get data with specific tags name
    let response = await fetch(
      `${url}apiKey=${API_KEY}&tags=${nameOfLanguage}`
    );
    // parse data to json
    let data = await response.json();

    // check localcstorage has a key quiz
    if (!localStorage.getItem("quiz")) {
      //create one
      localStorage.setItem("quiz", "[]");
    }
    // set data
    localStorage.setItem("quiz", JSON.stringify(data));
    // create boxes with data
    showQuestion(data);
  } catch (error) {
    console.log(error);
  }
}

function showQuestion(data) {
  // create element content
  let content = document.createElement("div");
  // set class content
  content.classList.add("content");
  // container of checkbox and label
  let groupinCheckBoxAndLable;
  // iterate on data
  for (let item of data) {
    // create box
    let box = document.createElement("div");
    // set class box
    box.classList.add("box");
    //check the first box has class acive
    if (i === 0) {
      //set class active to show it
      box.classList.add("active");
    } else {
      // set hidden to hide other boxs
      box.classList.add("hidden");
    }
    // create h1
    let title = document.createElement("h1");
    // set text question
    title.innerText = `Q${i + 1}: ${item.question}`;
    // add to box
    box.appendChild(title);
    // iterate on All answers
    for (let answer in item.answers) {
      // check the answer is different null
      if (item.answers[answer] != null) {
        // create div
        groupinCheckBoxAndLable = document.createElement("div");
        // set class grouping
        groupinCheckBoxAndLable.classList.add("grouping");
        // create element label
        let label = document.createElement("label");
        // set class label
        label.classList.add("label");
        // set anaswer in label
        label.innerText = item.answers[answer];
        // create input
        let radio = document.createElement("input");
        // set class radio
        radio.classList.add("radio");
        // set type
        radio.type = "radio";
        // set name
        radio.name = "check";
        // set value key name in object answers
        radio.value = answer;
        // add radio and label
        groupinCheckBoxAndLable.append(radio, label);
        // add groupinCheckBoxAndLable in box element
        box.append(groupinCheckBoxAndLable);
      }
    }
    // add box to content
    content.append(box);
    i++;
  }
  // add content to showQuestion
  showQuestions.appendChild(content);
}

function next(params) {
  // get all boxs
  let boxes = [...document.querySelectorAll(".box")];
  // set class active
  btnNext.classList.add("active");
  // remove the class active on all boxs with number count specific
  for (let item of boxes[count].children) {
    // check tagName of item equal DIV
    if (item.tagName === "DIV") {
      item.firstChild.classList.remove("active");
    }
  }
  // check count if less than length of boxs
  if (count < boxes.length - 1) {
    // remove class active beceause hase opacity 1 and display block;
    boxes[count].classList.remove("active");
    // add class hidden beceause have display block
    boxes[count].classList.add("hidden");
    // increment count
    count = count + 1;
    // remove class hidden
    boxes[count].classList.remove("hidden");
    // after 200ms add class active
    setTimeout(() => {
      // set class active
      boxes[count].classList.add("active");
    }, 200);
  } else {
    alert("your points of this test is: " + points);
  }
}

document.addEventListener("click", function (e) {
  // check if the element tagName is equal INPUT
  if (e.target.tagName === "INPUT") {
    // triger function verif
    verif(e.target.value, count, e.target);
    // stop selection on all radio of current box
    let boxes = [...document.querySelectorAll(".box")];
    for (let item of boxes[count].children) {
      if (item.tagName === "DIV") {
        item.firstChild.classList.add("active");
      }
    }
  }
});

// verif take answer and index and input checked
function verif(answer, index, input) {
  // set correct
  let correct;
  // check the quiz in local storage
  if (localStorage.getItem("quiz")) {
    // remove class active on btnNext
    btnNext.classList.remove("active");
    // get data from localStorage a,d parse in to array
    let quiz = JSON.parse(localStorage.getItem("quiz"));
    // use desructing from quiz
    let { correct_answers } = quiz[index];
    // iterate on all answer and check if any one has a true value
    for (let answer in correct_answers) {
      if (correct_answers[answer] === "true") {
        // replace "_correct" with empty value
        correct = answer.replace("_correct", "");
      }
    }

    // check correct is equal answer from input
    if (correct === answer) {
      // put style
      input.nextElementSibling.style.color = "green";
      // add point
      points = points + 5;
    } else {
      // change color
      input.nextElementSibling.style.color = "red";
      // show how's one is correct par defeaut if the answer is incorrect
      let boxes = [...document.querySelectorAll(".box")];
      for (let item of boxes[index].children) {
        if (item.tagName === "DIV") {
          // check the input has same value of correct
          if (item.firstChild.value === correct) {
            item.firstChild.nextElementSibling.style.color = "green";
          }
        }
      }
    }
  }
}
