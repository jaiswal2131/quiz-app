import {quizQuestions} from "./questions.js";


const timerValue = document.querySelector(".quiz-timer-value");
const progressBar = document.querySelector(".quiz-progress");
const question = document.querySelector(".quiz-question");
const options = document.querySelector(".quiz-options");
const currentQuestion = document.querySelector(".quiz-questions-current");
const totalQuestions = document.querySelector(".quiz-questions-total");

let timer = 10;
let currentTimer = timer;
let currentQuestionIndex = 0;
let totalQuestionsCount = 5;
let correctAnswers = totalQuestionsCount;
let isTimerPaused = false;

let questions = [];

function resetTimer(){
    currentTimer = timer;
}

function loadNextQuestion(){
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestionsCount){
        displayQuestion();
    }
}

function randomQuestions(numQuestions, displayQuestion){
    for (let i=0; i<numQuestions; i++){
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        questions.push(quizQuestions[randomIndex])
    }
    displayQuestion();
}



function checkOptions(event){
    const answer = questions[currentQuestionIndex].correctAnswer;
    const selectedAnswer = event.currentTarget.querySelector(".quiz-option-value").innerText;


    // console.log(options.querySelectorAll('.quiz-option'));
    options.querySelectorAll('.quiz-option').forEach(optionBtn =>{
        optionBtn.disabled = true;
        if (optionBtn.querySelector('.quiz-option-value').innerText === answer){
            optionBtn.classList.add("correct");
        }
    });
    
    if (selectedAnswer !== answer){
        event.currentTarget.classList.add("incorrect");
        correctAnswers--;
    }

    setTimeout(() => {
        isTimerPaused = true;
        loadNextQuestion();
    }, 3000);
}

function displayQuestion(){
    


    //set total questions and current question..
    totalQuestions.innerText = `${totalQuestionsCount}`;
    currentQuestion.innerText = `${currentQuestionIndex+1}`;

    //update the progress bar..
    progressBar.style.width = `${Math.floor( ((currentQuestionIndex+1)/totalQuestionsCount) * 100 )}%`;

    //displaying the question..
    question.innerHTML="";
    const quizIdx = document.createElement("h2");
    quizIdx.classList.add("quiz-question-index");
    quizIdx.innerText = `${currentQuestionIndex+1}.`;

    const quizQuestionText = document.createElement("span");
    quizQuestionText.classList.add("quiz-question-text");
    quizQuestionText.innerText = questions[currentQuestionIndex].question;

    question.append(quizIdx, quizQuestionText);


    //displaying options..
    options.innerHTML="";
    questions[currentQuestionIndex].options.forEach(option => {
        const optionBtn = document.createElement("button");
        optionBtn.classList.add("quiz-option");

        optionBtn.addEventListener("click", (event)=>{
            checkOptions(event); 
        });

        const optionVal = document.createElement("div");
        optionVal.classList.add("quiz-option-value");
        optionVal.innerText = option;

        const optionIcon = document.createElement("img");
        optionIcon.classList.add("quiz-option-icon");

        optionBtn.append(optionVal, optionIcon);
        options.append(optionBtn);
    });


    resetTimer();
    isTimerPaused=false;
    const timeOut = setInterval(() =>{
        if (!isTimerPaused){
            currentTimer--;
            if (currentTimer <= 0){
                loadNextQuestion();
                clearInterval(timeOut);
            }
            timerValue.innerText = `${currentTimer}s`;
        }
    }, 1000);
}


randomQuestions(totalQuestionsCount, displayQuestion);

// console.log(randomQuestions(5));
