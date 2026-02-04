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
    answer: "a) Brown"
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

  timerInterval = setInterval(() => {
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
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
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

I don’t know the exact moment my heart decided that you were home,
but I remember the feeling—a soft, steady warmth that made everything else quieter.
It’s in the way you make me smile without trying, the way you notice tiny things no one else sees,
and the way you make ordinary days feel like a gentle kind of magic.

I love our small moments: the half-finished conversations, the shared glances,
the way we laugh at the same silly stories. I love the way you care,
even when you think no one is watching. I love your courage, your kindness, your beautiful, curious mind.

When life feels heavy, you are my calm. When I’m unsure, you are my reminder to keep going.
With you, I’ve learned that love isn’t loud or complicated—it’s patient, honest,
and quietly certain, like the sun returning each morning.

I choose you—today and every day—for the way you make me better without asking,
for the way you make my world softer and brighter, and for the way my heart rests when you’re near.
Thank you for being you—unapologetically, beautifully you.

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



