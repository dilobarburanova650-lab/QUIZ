const $ = (id) => document.getElementById(id);
const socket = typeof io === "function" ? io() : null;

const BANK = {
  english: [
    ["3-sinf", "What is the plural of “cat”?", ["Cates", "Cats", "Caties", "Cat"], 1],
    ["3-sinf", "Choose the correct word: I ___ a student.", ["is", "are", "am", "be"], 2],
    ["3-sinf", "What is the opposite of “big”?", ["Small", "Tall", "Long", "Fast"], 0],
    ["4-sinf", "She ___ a red bag.", ["have", "has", "having", "are"], 1],
    ["4-sinf", "Yesterday, we ___ football.", ["play", "plays", "played", "playing"], 2],
    ["4-sinf", "Choose the correct article: ___ apple.", ["A", "An", "Thee", "No"], 1],
    ["5-sinf", "There ___ three books on the desk.", ["is", "am", "are", "be"], 2],
    ["5-sinf", "He usually ___ to school by bus.", ["go", "goes", "going", "went"], 1],
    ["5-sinf", "What is the past form of “buy”?", ["Buyed", "Bought", "Buys", "Buying"], 1],
    ["6-sinf", "If it rains, we ___ at home.", ["stayed", "staying", "will stay", "stays"], 2],
    ["6-sinf", "I have lived here ___ 2022.", ["for", "since", "during", "from"], 1],
    ["6-sinf", "Choose the comparative form of “good”.", ["Gooder", "More good", "Best", "Better"], 3],
    ["7-sinf", "She ___ her homework before dinner yesterday.", ["finishes", "has finished", "had finished", "finish"], 2],
    ["7-sinf", "If I ___ more time, I would learn French.", ["have", "had", "will have", "am having"], 1],
    ["7-sinf", "Neither Ali nor his friends ___ ready.", ["is", "was", "are", "be"], 2]
  ],
  russian: [
    ["3-sinf", "Как будет «kitob» по-русски?", ["Ручка", "Книга", "Окно", "Стол"], 1],
    ["3-sinf", "Выбери правильное слово: ___ мама.", ["Мой", "Моя", "Моё", "Мои"], 1],
    ["3-sinf", "Сколько дней в неделе?", ["Пять", "Шесть", "Семь", "Восемь"], 2],
    ["4-sinf", "Какое слово отвечает на вопрос «кто?»", ["Стол", "Кошка", "Окно", "Море"], 1],
    ["4-sinf", "Множественное число слова «дом» — это…", ["Домы", "Дома", "Домовья", "Дом"], 1],
    ["4-sinf", "Выбери антоним к слову «высокий».", ["Большой", "Низкий", "Длинный", "Широкий"], 1],
    ["5-sinf", "Какой род у слова «молоко»?", ["Мужской", "Женский", "Средний", "Общий"], 2],
    ["5-sinf", "В каком слове ударение падает на второй слог?", ["Ма́ма", "Вода́", "О́кна", "Ко́шка"], 1],
    ["5-sinf", "Выбери глагол.", ["Красивый", "Быстро", "Читать", "Книга"], 2],
    ["6-sinf", "Какое слово является прилагательным?", ["Бежать", "Весёлый", "Сегодня", "Быстро"], 1],
    ["6-sinf", "Выбери правильное окончание: «Я читаю интересн… книгу».", ["-ый", "-ое", "-ую", "-ые"], 2],
    ["6-sinf", "Какой падеж отвечает на вопрос «кому? чему?»", ["Именительный", "Родительный", "Дательный", "Творительный"], 2],
    ["7-sinf", "В каком предложении есть однородные члены?", ["Солнце взошло.", "Мама купила яблоки, груши и сливы.", "Наступила ночь.", "Дети спят."], 1],
    ["7-sinf", "Найди наречие.", ["Смелый", "Смелость", "Смело", "Смелеть"], 2],
    ["7-sinf", "Какой частью речи является слово «который»?", ["Союз", "Местоимение", "Глагол", "Наречие"], 1]
  ],
  math: [
    ["3-sinf", "245 + 138 = ?", ["373", "383", "393", "283"], 1],
    ["3-sinf", "7 × 8 = ?", ["54", "56", "64", "48"], 1],
    ["3-sinf", "900 − 275 = ?", ["625", "635", "725", "615"], 0],
    ["4-sinf", "36 ÷ 4 + 7 = ?", ["9", "16", "14", "18"], 1],
    ["4-sinf", "To‘g‘ri to‘rtburchakning bo‘yi 8 cm, eni 5 cm. Perimetri?", ["13 cm", "26 cm", "40 cm", "30 cm"], 1],
    ["4-sinf", "3/4 ning 20 ga teng qismi emas, 20 ning 3/4 qismi nechaga teng?", ["10", "12", "15", "18"], 2],
    ["5-sinf", "2,5 + 3,75 = ?", ["5,25", "6,25", "6,15", "5,75"], 1],
    ["5-sinf", "EKUB(18, 24) nechaga teng?", ["3", "6", "12", "72"], 1],
    ["5-sinf", "x + 17 = 42. x = ?", ["25", "59", "24", "26"], 0],
    ["6-sinf", "−8 + 15 − 6 = ?", ["−1", "1", "13", "−29"], 1],
    ["6-sinf", "200 ning 15 foizi qancha?", ["15", "20", "30", "35"], 2],
    ["6-sinf", "3x − 7 = 20. x = ?", ["7", "8", "9", "11"], 2],
    ["7-sinf", "2(x + 3) = 18. x = ?", ["6", "9", "12", "3"], 0],
    ["7-sinf", "a² − b² formulasi qaysi?", ["(a−b)²", "(a−b)(a+b)", "a²+b²", "2ab"], 1],
    ["7-sinf", "Tenglamani yech: 5x + 4 = 2x + 19.", ["3", "4", "5", "6"], 2]
  ]
};

const state = {
  subject: "english", questions: [], index: 0, score: 0, correct: 0,
  timer: null, seconds: 10, locked: false, room: null,
  isHost: false, playerName: "", roomPlayers: []
};

const subjectNames = {
  english: "🇬🇧 Ingliz tili",
  russian: "🇷🇺 Rus tili",
  math: "🧮 Matematika"
};

function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2500);
}

function getName() {
  const entered = $("playerName").value.trim();
  const saved = localStorage.getItem("quizoraName") || "";
  const name = entered || saved || prompt("Ismingni yoz:") || "";
  if (!name.trim()) {
    toast("Avval ismingni yoz!");
    return "";
  }
  const clean = name.trim().slice(0, 20);
  $("playerName").value = clean;
  localStorage.setItem("quizoraName", clean);
  state.playerName = clean;
  return clean;
}

$("nameBtn").addEventListener("click", () => {
  const name = prompt("Ismingni yoz:", state.playerName || localStorage.getItem("quizoraName") || "");
  if (name && name.trim()) {
    state.playerName = name.trim().slice(0, 20);
    $("playerName").value = state.playerName;
    localStorage.setItem("quizoraName", state.playerName);
    toast("Isming saqlandi!");
  }
});

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function showRoomLink(code) {
  const url = new URL(location.href);
  url.searchParams.set("room", code);
  $("shareLink").textContent = url.toString();
  $("shareArea").classList.remove("hidden");
  $("roomMessage").textContent = `Xona kodi: ${code}. Do‘stlaringga havolani yubor!`;
}

$("createBtn").addEventListener("click", () => {
  if (!getName()) return;
  if (!socket || !socket.connected) {
    toast("Serverga ulanish yo‘q. npm start orqali ishga tushir.");
    return;
  }
  socket.emit("createRoom", { name: state.playerName }, (response) => {
    if (!response?.ok) return toast(response?.error || "Xona yaratilmadi");
    state.room = response.code;
    state.isHost = true;
    showRoomLink(response.code);
    toast("Xona yaratildi! Do‘stlaringni taklif qil.");
  });
});

$("joinBtn").addEventListener("click", () => {
  if (!getName()) return;
  const code = $("roomCode").value.trim().toUpperCase() ||
               new URLSearchParams(location.search).get("room") || "";
  if (!code) {
    toast("Xona kodini yoz yoki do‘sting yuborgan havolani och.");
    return;
  }
  if (!socket || !socket.connected) {
    toast("Server ishlamayapti. Terminalda npm start yoz.");
    return;
  }
  socket.emit("joinRoom", { code, name: state.playerName }, (response) => {
    if (!response?.ok) return toast(response?.error || "Xonaga kirib bo‘lmadi");
    state.room = response.code;
    state.isHost = false;
    $("roomMessage").textContent = `${response.code} xonasiga kirding.`;
    toast("Xonaga muvaffaqiyatli kirding!");
  });
});

$("copyLinkBtn").addEventListener("click", async () => {
  const link = $("shareLink").textContent;
  try {
    await navigator.clipboard.writeText(link);
    toast("Havola nusxalandi!");
  } catch {
    prompt("Havolani nusxalash uchun Ctrl+C bosing:", link);
  }
});

if (socket) {
  socket.on("connect", () => console.log("QUIZORA serverga ulandi"));
  socket.on("connect_error", () => console.log("Server bilan aloqa yo‘q"));

  socket.on("roomUpdate", (data) => {
    state.roomPlayers = data.players || [];
    $("roomMessage").textContent =
      `Xona ${data.code}: ` +
      state.roomPlayers.map(p => p.name).join(", ");
  });

  socket.on("quizStarted", ({ subject }) => {
    state.subject = subject;
    startQuiz(false);
  });

  socket.on("playerAnswered", ({ name }) => {
    toast(`${name} javob berdi!`);
  });
}

function startQuiz(announce = true) {
  if (announce && state.room && socket && state.isHost) {
    const subject = state.subject;
    socket.emit("startQuiz", { code: state.room, subject }, (res) => {
      if (!res?.ok) toast(res?.error || "Testni boshlab bo‘lmadi");
    });
  }

  state.questions = BANK[state.subject].map((q, i) => ({
    grade: q[0], text: q[1], answers: q[2], correct: q[3], number: i
  }));
  state.index = 0;
  state.score = 0;
  state.correct = 0;
  state.locked = false;

  $("resultScreen").classList.add("hidden");
  $("quizScreen").classList.remove("hidden");
  $("quizSubject").textContent = subjectNames[state.subject];
  $("quizScreen").scrollIntoView({ behavior: "smooth", block: "start" });
  renderQuestion();
}

document.querySelectorAll(".subject-card").forEach(button => {
  button.addEventListener("click", () => {
    state.subject = button.dataset.subject;
    if (state.room && !state.isHost) {
      toast("Testni xona egasi boshlaydi.");
      return;
    }
    startQuiz(true);
  });
});

function renderQuestion() {
  clearInterval(state.timer);
  state.locked = false;
  state.seconds = 10;

  const q = state.questions[state.index];
  if (!q) return finishQuiz();

  $("questionCount").textContent = `Savol ${state.index + 1} / ${state.questions.length}`;
  $("scoreText").textContent = `⭐ ${state.score} ball`;
  $("timerText").textContent = `⏱️ ${state.seconds}`;
  $("progressBar").style.width = `${(state.index / state.questions.length) * 100}%`;
  $("gradeLabel").textContent = q.grade;
  $("questionText").textContent = q.text;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("answers").innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = `${["🟣", "🩷", "🟦", "🟠"][index]}  ${answer}`;
    button.addEventListener("click", () => chooseAnswer(index, button));
    $("answers").appendChild(button);
  });

  state.timer = setInterval(() => {
    state.seconds--;
    $("timerText").textContent = `⏱️ ${state.seconds}`;
    if (state.seconds <= 3) $("timerText").style.color = "#ff5374";
    if (state.seconds > 3) $("timerText").style.color = "#ffcf70";
    if (state.seconds <= 0) chooseAnswer(-1, null);
  }, 1000);
}

function chooseAnswer(choice, clickedButton) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);

  const q = state.questions[state.index];
  const buttons = [...$("answers").querySelectorAll("button")];
  buttons.forEach(button => button.disabled = true);

  const correctButton = buttons[q.correct];
  const feedback = $("feedback");

  if (choice === q.correct) {
    state.correct++;
    state.score += Math.max(100, state.seconds * 100);
    clickedButton?.classList.add("correct");
    feedback.textContent = "🎉 To‘g‘ri! Zo‘r javob!";
    feedback.className = "feedback good";
  } else {
    if (clickedButton) clickedButton.classList.add("wrong");
    correctButton?.classList.add("reveal");
    feedback.textContent = choice === -1
      ? "⏰ Vaqt tugadi! Yashil javob — to‘g‘ri javob."
      : "❌ Bu noto‘g‘ri! Yashil javobni ko‘rib ol.";
    feedback.className = "feedback bad";
  }

  $("scoreText").textContent = `⭐ ${state.score} ball`;
  if (socket && state.room) {
    socket.emit("answer", { code: state.room, name: state.playerName });
  }

  setTimeout(() => {
    state.index++;
    if (state.index < state.questions.length) renderQuestion();
    else finishQuiz();
  }, 1400);
}

function finishQuiz() {
  clearInterval(state.timer);
  $("quizScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");

  const total = state.questions.length;
  const percent = Math.round((state.correct / total) * 100);

  $("finalScore").textContent = state.score;
  $("correctCount").textContent = `${state.correct}/${total}`;
  $("accuracy").textContent = `${percent}%`;
  $("resultTitle").textContent =
    percent >= 80 ? "🏆 Ajoyib natija!" :
    percent >= 50 ? "👏 Yaxshi harakat!" : "💪 Yana urinib ko‘r!";
  $("resultSummary").textContent =
    `${state.playerName || "O‘yinchi"}, ${total} ta savoldan ${state.correct} tasiga to‘g‘ri javob berding.`;
  $("progressBar").style.width = "100%";

  const history = JSON.parse(localStorage.getItem("quizoraResults") || "[]");
  history.push({
    subject: state.subject, score: state.score, correct: state.correct,
    total, date: new Date().toISOString()
  });
  localStorage.setItem("quizoraResults", JSON.stringify(history.slice(-30)));
  $("resultScreen").scrollIntoView({ behavior: "smooth", block: "center" });
}

$("fullscreenBtn").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await $("quizScreen").requestFullscreen();
      document.body.classList.add("fullscreen-mode");
      $("fullscreenBtn").textContent = "⛶ Ekrandan chiqish";
    } else {
      await document.exitFullscreen();
    }
  } catch {
    toast("Brauzering to‘liq ekranni qo‘llab-quvvatlamadi.");
  }
});

document.addEventListener("fullscreenchange", () => {
  const active = Boolean(document.fullscreenElement);
  document.body.classList.toggle("fullscreen-mode", active);
  $("fullscreenBtn").textContent = active ? "⛶ Ekrandan chiqish" : "⛶ To‘liq ekran";
});

function exitQuiz() {
  clearInterval(state.timer);
  $("quizScreen").classList.add("hidden");
  $("resultScreen").classList.add("hidden");
  document.body.classList.remove("fullscreen-mode");
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  document.querySelector("#subjects").scrollIntoView({ behavior: "smooth" });
}

$("exitBtn").addEventListener("click", exitQuiz);
$("homeBtn").addEventListener("click", exitQuiz);
$("againBtn").addEventListener("click", () => startQuiz(false));

$("playerName").value = localStorage.getItem("quizoraName") || "";
const initialRoom = new URLSearchParams(location.search).get("room");
if (initialRoom) $("roomCode").value = initialRoom.toUpperCase();