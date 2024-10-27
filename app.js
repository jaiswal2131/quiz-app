import {quizQuestions} from "./questions.js";

const question = document.querySelector(".quiz-question");
const options = document.querySelector(".quiz-options");
const progressBar = document.querySelector(".quiz-progress");
const quizTimer = document.querySelector(".quiz-timer");
const quizContainer = document.querySelector(".quiz-question-container");
const quizFooter = document.querySelector(".quiz-footer");
// const quizHeader = document.querySelector(".quiz-header-content");
const timerHTML = quizTimer.innerHTML;
const containerHTML = quizContainer.innerHTML;
const footerHTML = quizFooter.innerHTML;  

let timer;
let currentTimer;
let currentQuestionIndex;
let totalQuestionsCount = 10;
let correctAnswers;
let isTimerPaused;
let waitTime = 1;
let questions;

function resetTimer(){
    currentTimer = timer;
}

function reset(){
    timer = 10;
    resetTimer();
    currentQuestionIndex = 0;
    correctAnswers =0;
    isTimerPaused = false;
    questions = [];

    quizTimer.innerHTML = timerHTML;
    quizContainer.innerHTML = containerHTML;
    quizFooter.innerHTML = footerHTML;
}


function loadNextQuestion(){
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestionsCount){
        displayQuestion();
    }else{
        displayResult();
    }
}


function randomQuestions(numQuestions, displayQuestion){
    reset();
    for (let i=0; i<numQuestions; i++){
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        questions.push(quizQuestions[randomIndex])
    }
    displayQuestion();
}

function displayResult(){
    
    quizTimer.innerHTML = "";
    quizTimer.style.backgroundColor = "white";
    quizContainer.innerHTML = "";
    quizFooter.innerHTML = "";
    quizContainer.classList.remove('scrollable');

    progressBar.style.width = `${Math.floor( ((currentQuestionIndex)/totalQuestionsCount) * 100 )}%`;

    const scoreHeading = document.createElement("h1");
    scoreHeading.classList.add("score-heading");
    scoreHeading.innerText = "Your Score";

    const scoreValue = document.createElement("div");
    scoreValue.classList.add("score-value");
    scoreValue.innerText = `${correctAnswers} / ${totalQuestionsCount} (${Math.floor((correctAnswers/totalQuestionsCount)*100)}%)`;

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const viewAnswerBtn = document.createElement("button");
    viewAnswerBtn.classList.add("view-answer-button");
    viewAnswerBtn.addEventListener("click", (event)=>{
        displayAnswers();
    });
    const viewBtnText = document.createElement("span");
    viewBtnText.classList.add("button-text");
    viewBtnText.innerText = "View Answers";
    viewAnswerBtn.append(viewBtnText);

    const playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("play-again-button");
    playAgainBtn.addEventListener("click", (event)=>{
        randomQuestions(totalQuestionsCount, displayQuestion);
    })
    const playBtnText = document.createElement("span");
    playBtnText.classList.add("button-text");
    playBtnText.innerText = "Play Again";
    playAgainBtn.append(playBtnText);

    buttons.append(viewAnswerBtn, playAgainBtn);

    quizContainer.append(scoreHeading, scoreValue);
    quizFooter.append(buttons);
}

function displayAnswers(){
    quizTimer.innerHTML = "";
    quizTimer.style.backgroundColor = "white";
    quizContainer.innerHTML = "";
    quizFooter.innerHTML = "";
    quizContainer.classList.add('scrollable');

    let questionIdx = 1;
    questions.forEach(questionObj =>{
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("display-question-container");

        const displayQuestionText = document.createElement("span");
        displayQuestionText.classList.add("display-question-text");
        displayQuestionText.innerText = `${questionIdx}. ${questionObj.question}`;

        const displayQuestionAnswer = document.createElement("button");
        displayQuestionAnswer.classList.add("display-question-answer");
        displayQuestionAnswer.innerText = questionObj.correctAnswer;

        questionContainer.append(displayQuestionText, displayQuestionAnswer);
        quizContainer.append(questionContainer);

        questionIdx++;
    });

    // console.log(quizContainer);
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.innerText = "Back";

    backButton.addEventListener("click", ()=>{
        displayResult();
    })

    quizFooter.append(backButton);

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
    }else{
        correctAnswers++;
    }

    isTimerPaused = true;
    setTimeout(() => {
        loadNextQuestion();
    }, waitTime*1000);
}

function displayQuestion(){
    quizContainer.classList.remove('scrollable');
    
    
    //start the timer..
    const timerValue = document.querySelector(".quiz-timer-value");
    resetTimer();
    isTimerPaused=false;
    // console.log(quizTimer);
    const timeOut = setInterval(() =>{
        if (!isTimerPaused){
            timerValue.innerText = `${currentTimer}s`;
            currentTimer--;
            if (currentTimer < 0){
                loadNextQuestion();
                clearInterval(timeOut);
            }
        }else{
            clearInterval(timeOut);
        }
    }, 1000);
    
    quizContainer.innerHTML = "";

    //set total questions and current question..
    const currentQuestion = document.querySelector(".quiz-questions-current");
    const totalQuestions = document.querySelector(".quiz-questions-total");
    totalQuestions.innerText = `${totalQuestionsCount}`;
    currentQuestion.innerText = `${currentQuestionIndex+1}`;

    //update the progress bar..
    progressBar.style.width = `${Math.floor( ((currentQuestionIndex)/totalQuestionsCount) * 100 )}%`;

    //displaying the question..
    question.innerHTML="";
    const quizIdx = document.createElement("h2");
    quizIdx.classList.add("quiz-question-index");
    quizIdx.innerText = `${currentQuestionIndex+1}.`;

    const quizQuestionText = document.createElement("span");
    quizQuestionText.classList.add("quiz-question-text");
    quizQuestionText.innerText = questions[currentQuestionIndex].question;

    question.append(quizIdx, quizQuestionText);

    // console.log(question);


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

    // console.log(options);
    quizContainer.append(question, options);

    
}


randomQuestions(totalQuestionsCount, displayQuestion);

// console.log(randomQuestions(5));
