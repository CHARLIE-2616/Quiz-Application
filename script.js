// script.js
let questions = [
  {
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kerala", "Chennai"],
    answer: 0
  },
  {
    question: "What is the national animal of India?",
    options: ["Tiger", "Elephant", "Lion", "Peacock"],
    answer: 0
  },
  {
    question: "Which city is known as the 'Silicon Valley of India'?",
    options: ["Hyderabad", "Chennai", "Bengaluru", "Kochi"],
    answer: 2
  },
  {
    question: "Which temple in Tamil Nadu is famous for its architecture and is a UNESCO World Heritage Site?",
    options: ["Meenakshi Temple", "Brihadeeswarar Temple", "Ramanathaswamy Temple", "Kapaleeshwarar Temple"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeRemaining = 300; // Overall timer for the entire quiz (5 minutes)
let selectedOptions = Array(questions.length).fill(null);

function startTimer() {
  timer = setInterval(() => {
    timeRemaining--;
    document.getElementById("timer").innerText = formatTime(timeRemaining);
    if (timeRemaining <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function loadQuestion() {
  if (currentQuestion < questions.length) {
    document.getElementById("question-number").innerText = currentQuestion + 1;
    document.getElementById("question").innerText = questions[currentQuestion].question;
    let options = document.querySelectorAll(".option");
    options.forEach((option, index) => {
      option.innerText = questions[currentQuestion].options[index];
      option.disabled = false;
      option.classList.remove("correct", "incorrect", "selected");
      option.setAttribute("data-value", index);
      if (selectedOptions[currentQuestion] === index) {
        option.classList.add("selected");
      }
    });
    document.getElementById("next").style.display = currentQuestion === questions.length - 1 ? "none" : "block";
    document.getElementById("submit").style.display = currentQuestion === questions.length - 1 ? "block" : "none";
  }
}

function loadNavigation() {
  let navItems = document.getElementById("nav-items");
  navItems.innerHTML = ''; // Clear previous items
  questions.forEach((question, index) => {
    let navItem = document.createElement("div");
    navItem.classList.add("nav-item");
    navItem.innerText = `Q${index + 1}`;
    navItem.onclick = () => navigateToQuestion(index);
    navItems.appendChild(navItem);
  });
}

function updateNavigation() {
  let navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((navItem, index) => {
    navItem.classList.remove("answered");
    if (selectedOptions[index] !== null) {
      navItem.classList.add("answered");
    }
  });
}

function navigateToQuestion(index) {
  currentQuestion = index;
  loadQuestion();
  updateNavigation();
}

function selectOption(element) {
  let options = document.querySelectorAll(".option");
  options.forEach(option => {
    option.classList.remove("selected");
  });
  element.classList.add("selected");
  selectedOptions[currentQuestion] = parseInt(element.getAttribute("data-value"));
  updateNavigation();
}

function nextQuestion() {
  currentQuestion++;
  loadQuestion();
  updateNavigation();
}

function submitQuiz() {
  clearInterval(timer);
  score = 0;
  questions.forEach((question, index) => {
    if (selectedOptions[index] === question.answer) {
      score++;
    }
  });
  showResults();
}

function showResults() {
  document.querySelector("main .content").innerHTML = `<h2>Your score is ${score} out of ${questions.length}</h2>
    <button id="retake" onclick="retakeQuiz()">Retake Quiz</button>`;
}

function retakeQuiz() {
  currentQuestion = 0;
  score = 0;
  timeRemaining = 300;
  selectedOptions = Array(questions.length).fill(null);
  document.querySelector("main .content").innerHTML = `
    <div class="question-number">Question <span id="question-number">1</span></div>
    <div class="question" id="question"></div>
    <div class="options">
      <button class="option" onclick="selectOption(this)" data-value="0"></button>
      <button class="option" onclick="selectOption(this)" data-value="1"></button>
      <button class="option" onclick="selectOption(this)" data-value="2"></button>
      <button class="option" onclick="selectOption(this)" data-value="3"></button>
    </div>
    <button id="next" onclick="nextQuestion()">Next</button>
    <button id="submit" onclick="submitQuiz()" style="display: none;">Submit</button>
  `;
  loadNavigation();
  loadQuestion();
  startTimer();
}

window.onload = () => {
  loadNavigation();
  loadQuestion();
  startTimer();
};
