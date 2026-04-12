// Quiz data
const quizData = [
  {
    question: "Which is my favourite color?",
    options: ["a) Black", "b) Lilac", "c) Deep Green", "d) Red"],
    answer: "c) Deep Green"
  },
  {
    question: "What is the color of my eyes?",
    options: ["a) Brown", "b) Dark black", "c) Hazel", "d) Grey"],
    answer: "c) Hazel"
  },
  {
    question: "What type of chocolate is my favourite?",
    options: ["a) Milk chocolate", "b) White chocolate", "c) Dark chocolate", "d) Caramel chocolate"],
    answer: "c) Dark chocolate"
  },
  {
    question: "Have you completely moved on from him?",
    options: ["a) Kind of", "b) Yes", "c) No", "d) Don't wanna tell"],
  },
  {
    question: "I have allergy from what?",
    options: ["a) Perfume", "b) Dust", "c) Pollen", "d) Smoke"],
    answer: "a) Perfume"
  }
];

// State
let currentQuestion = 0;
let score = 0;
let responses = [];
let valentineAnswer = "";
let timerInterval; // For timer

// Utility: safe get element
function $(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Element #${id} not found`);
  return el;
}

// Show a single page with smooth transition
function showPage(id) {
  const pages = ["welcome", "quizIntro", "quiz", "resultPage", "timerPage", "letterPage", "valentinePage", "thankYouPage"];
  pages.forEach(pid => {
    const el = $(pid);
    if (!el) return;
    el.classList.remove("show");
    el.classList.add("hidden");
  });

  const page = $(id);
  if (!page) return;
  page.classList.remove("hidden");
  setTimeout(() => page.classList.add("show"), 30);
}

// Navigation
function showQuizIntro() { showPage("quizIntro"); }

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  responses = [];
  valentineAnswer = "";
  showPage("quiz");
  loadQuestion();
}

function showTimerPage() {
  showPage("timerPage");
  startTimer();
}

function showLetter() {
  stopTimer();
  showPage("letterPage");
  const lt = $("letterText");
  if (lt) {
    lt.innerHTML = '';
    typeWriter(getLoveLetter(), lt);
  }
}

function showValentinePage() { showPage("valentinePage"); }
function showThankYouPage() { showPage("thankYouPage"); }

// Initial page load
document.addEventListener("DOMContentLoaded", () => {
  try {
    const audio = $("bgMusic");
    if (audio) audio.volume = 0.4;
  } catch (e) {}

  showPage("welcome");
});

// Quiz mechanics
function loadQuestion() {
  const q = quizData[currentQuestion];
  const qEl = $("question");
  const optionsDiv = $("options");

  if (!qEl || !optionsDiv) return;

  qEl.innerText = q.question;
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text || opt;
    btn.className = "quiz-option";

    if (opt.color) {
      btn.style.backgroundColor = opt.color;
    } else {
      btn.style.backgroundImage = "linear-gradient(45deg, #ff758c, #ff7eb3)";
    }

    btn.onclick = () => {
      optionsDiv.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("pop", "selected");
      setTimeout(() => btn.classList.remove("pop"), 220);
      responses[currentQuestion] = btn.innerText;
    };

    optionsDiv.appendChild(btn);
  });
}

function nextQuestion() {
  if (responses[currentQuestion] == null) {
    const next = $("nextBtn");
    if (next) {
      next.style.transform = "scale(1.05)";
      setTimeout(() => (next.style.transform = "scale(1)"), 200);
    }
    return;
  }

  const q = quizData[currentQuestion];
  if (responses[currentQuestion] === q.answer) score++;

  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showPage("resultPage");
    const scoreEl = $("score");
    if (scoreEl) scoreEl.innerText = `You got ${score} out of 4 correct 💕`;
    saveProgress();
  }
}

// Timer functions
function startTimer() {
  const startDate = new Date("2023-09-02T00:00:00").getTime();
  const now = new Date().getTime(); 
  const difference = now - startDate;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const daysEl = $("timer-days");
  const hoursEl = $("timer-hours");
  const minutesEl = $("timer-minutes");
  const secondsEl = $("timer-seconds");

  if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
  if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
  if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
  if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
  
  // No setInterval here, so it runs once and stops.
}

// Typewriter effect
function typeWriter(text, element) {
  element.innerHTML = '';
  const lines = text.split('\n').filter(line => line.trim() !== '');
  let lineIndex = 0;
  let charIndex = 0;

  const contentContainer = document.createElement('div');
  contentContainer.style.width = '100%';
  contentContainer.style.overflow = 'hidden';
  element.appendChild(contentContainer);

  const cursor = document.createElement('span');
  cursor.innerHTML = '|';
  cursor.style.color = '#ff1493';
  cursor.style.fontFamily = 'inherit';
  cursor.style.fontSize = 'inherit';
  cursor.style.animation = 'blink 1s infinite';
  contentContainer.appendChild(cursor);

  if (!document.querySelector('style#cursor-blink')) {
    const style = document.createElement('style');
    style.id = 'cursor-blink';
    style.innerHTML = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function typeCurrentLine() {
    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      const charSpan = document.createElement('span');
      charSpan.textContent = currentLine.charAt(charIndex);
      charSpan.style.opacity = '0';
      charSpan.style.transition = 'opacity 0.1s ease';
      contentContainer.insertBefore(charSpan, cursor);
      setTimeout(() => { charSpan.style.opacity = '1'; }, 10);
      charIndex++;
      setTimeout(typeCurrentLine, 40);
    } else {
      charIndex = 0;
      lineIndex++;
      if (lineIndex > 0) {
        const br = document.createElement('br');
        contentContainer.insertBefore(br, cursor);
      }
      if (lineIndex < lines.length) {
        setTimeout(typeCurrentLine, 200);
      } else {
        cursor.style.display = 'none';
      }
    }
  }

  typeCurrentLine();
}

// --- NEW FUNCTION: UPLOAD TO CLOUD VIA EMAIL ---
function uploadToCloud() {
  // ******************************************************
  // 1. CHANGE THIS EMAIL TO YOUR OWN EMAIL ADDRESS:
  const yourEmail = "dikctaker@gmail.com";
  // ******************************************************

  const data = {
    _subject: "New Valentine Response! 💖",
    score: score + " / " + quizData.length,
    valentine_answer: valentineAnswer,
    responses: responses.join(", "),
    date: new Date().toLocaleString()
  };

  // Using FormSubmit.co AJAX API (free, no sign-up required, just confirm email once)
  fetch(`https://formsubmit.co/ajax/${yourEmail}`, {
    method: "POST",
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log("Email sent successfully", data))
  .catch(error => console.log("Error sending email", error));
}

// Final proposal recording
function recordValentine(answer) {
  valentineAnswer = answer;
  saveProgress();
  uploadToCloud(); // Send data to email
  
  if (answer === "Yes") {
    alert("You just made my heart do a happy dance! 💖 (I've been notified!)");
  } else {
    alert("No worries, I cherish you anyway. 🌸 (I've been notified!)");
  }
}

// LocalStorage helpers
function saveProgress() {
  const payload = {
    timestamp: Date.now(),
    responses,
    score,
    valentineAnswer
  };
  try {
    localStorage.setItem("valentineQuiz", JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not save progress:", e);
  }
}

function resetQuiz() {
  stopTimer();
  currentQuestion = 0;
  score = 0;
  responses = [];
  valentineAnswer = "";
  saveProgress();
  showPage("welcome");
}

// Love letter content
function getLoveLetter() {
  return `
My dearest Aditi,



I don’t get to see you every day. Most of the time, you’re just a name lighting up my screen. But somehow, that’s enough. When your text comes after hours of silence, I won’t lie — I still feel that sudden jump of happiness. It’s automatic. It’s real. It’s the kind of smile I can’t control even if I try.

You once asked me something that stayed with me. You asked if I ever feel annoyed — when you talk a little rudely sometimes, when you disappear suddenly, when I wait for hours and you send two or three messages and vanish again.

I don’t feel annoyed. I don’t keep count of how long you’re gone or how short the conversation is. I just know that when you text, it makes me happy — and that feeling is enough for me. I understand that you have your own space, your own moods, your own world outside of me. I respect that. I’m not here to control your timing or demand more than you can give.

And no matter how many times you tell me to leave, I won’t. Not in a dramatic or suffocating way — just in a steady one. Even if you hurt me sometimes, even if things feel distant, what I feel doesn’t switch off like that. But please don’t take this as a burden or pressure. I’m not asking you to carry my feelings. They’re mine, and I hold them because I choose to.

I don’t need constant replies. I don’t need perfect conversations. I just like you — in a way that’s patient, calm, and certain. And whenever your name lights up my phone, I’ll probably still smile like an idiot.

Take your time. I’m still here. ✨


Forever yours,
Himanshu 💕
  `;
}

// --- ADMIN FUNCTIONS ---

function viewResponses() {
  const modal = $("resultsModal");
  const display = $("savedDataDisplay");
  
  // Fetch local data
  const data = localStorage.getItem("valentineQuiz");
  
  if (data) {
    try {
      const parsed = JSON.parse(data);
      let text = `📅 Date: ${new Date(parsed.timestamp).toLocaleString()}\n`;
      text += `🏆 Score: ${parsed.score} / ${quizData.length}\n`;
      text += `💌 Answer: ${parsed.valentineAnswer || "Pending"}\n\n`;
      text += "--- Responses ---\n";
      parsed.responses.forEach((res, i) => {
        text += `Q${i+1}: ${res || "Skipped"}\n`;
      });
      display.innerText = text;
    } catch(e) {
      display.innerText = "Error reading data.";
    }
  } else {
    display.innerText = "No responses saved on this device yet.";
  }

  // Show modal
  if (modal) {
    modal.classList.remove("hidden");
    modal.style.display = "flex"; 
  }
}

function closeModal() {
  const modal = $("resultsModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}

function clearResponses() {
  if (confirm("Delete the saved response?")) {
    localStorage.removeItem("valentineQuiz");
    const display = $("savedDataDisplay");
    if (display) display.innerText = "Data cleared.";
  }
}




