// =====================================
// CHANGE THIS TO YOUR ACTUAL ANNIVERSARY
// =====================================

const startDate = new Date("2026-08-27T00:00:00");

// =====================================
// ANNIVERSARY COUNTER
// =====================================

function updateCounter() {
    const now = new Date();
    const difference = now - startDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const dayEl = document.getElementById("days");
    const hourEl = document.getElementById("hours");
    const minuteEl = document.getElementById("minutes");
    const secondEl = document.getElementById("seconds");

    if (dayEl) dayEl.textContent = days;
    if (hourEl) hourEl.textContent = hours;
    if (minuteEl) minuteEl.textContent = minutes;
    if (secondEl) secondEl.textContent = seconds;
}

updateCounter();
setInterval(updateCounter, 1000);

// =====================================
// SMOOTH SCROLL
// =====================================

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// =====================================
// PHOTO MODAL
// =====================================

const galleryItems = document.querySelectorAll(".gallery-item");
const modal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

galleryItems.forEach(item => {
    item.addEventListener("click", () => {
        const image = item.querySelector("img");
        if (!image || !modal || !modalImage) return;

        modalImage.src = image.src;
        modal.classList.add("show");
        createHearts(15);
    });
});

if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

if (modal) {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
}

// =====================================
// SURPRISE
// =====================================

const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseBox = document.getElementById("surpriseBox");

if (surpriseBtn && surpriseBox) {
    surpriseBtn.addEventListener("click", () => {
        surpriseBox.classList.toggle("show");

        if (surpriseBox.classList.contains("show")) {
            surpriseBtn.textContent = "❤️ Hide Surprise";
            createHearts(50);
        } else {
            surpriseBtn.textContent = "🎁 Open Your Surprise";
        }
    });
}

// =====================================
// MUSIC
// =====================================

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

let musicPlaying = false;

if (musicBtn && music) {
    musicBtn.addEventListener("click", () => {
        if (!musicPlaying) {
            music.play();
            musicPlaying = true;
            musicBtn.textContent = "🔊 Music On";
        } else {
            music.pause();
            musicPlaying = false;
            musicBtn.textContent = "🎵 Music";
        }
    });
}

// =====================================
// FLOATING HEARTS
// =====================================

function createHeart() {
    const heartContainer = document.querySelector(".hearts");
    if (!heartContainer) return;

    const heart = document.createElement("div");
    heart.classList.add("heart");

    const heartTypes = ["❤️", "💕", "💗", "💖", "💓", "💘"];
    heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = Math.random() * 25 + 15 + "px";
    heart.style.animationDuration = Math.random() * 4 + 4 + "s";

    heartContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

function createHearts(amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(createHeart, i * 80);
    }
}

setInterval(createHeart, 900);

// =====================================
// CLICK ANYWHERE = LITTLE HEART
// =====================================

document.addEventListener("click", event => {
    if (
        event.target.closest("button") ||
        event.target.closest(".gallery-item") ||
        event.target.closest(".modal") ||
        event.target.closest(".memory-card")
    ) {
        return;
    }

    const heartContainer = document.querySelector(".hearts");
    if (!heartContainer) return;

    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = "💗";

    heart.style.left = event.clientX + "px";
    heart.style.bottom = window.innerHeight - event.clientY + "px";
    heart.style.animationDuration = "2s";

    heartContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 2000);
});

// =====================================
// LOVE MATCH GAME
// =====================================

const gameGrid = document.getElementById("memoryGame");
const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");
const restartBtn = document.getElementById("restartGame");

const symbols = ["💖", "💞", "💘", "💗", "💝", "💕", "💓", "💌"];
let cards = [];
let flippedCards = [];
let moveCount = 0;
let matches = 0;
let lockBoard = false;

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function createGame() {
    const pairs = shuffle([...symbols, ...symbols]);
    gameGrid.innerHTML = "";

    cards = pairs.map((symbol, index) => {
        const card = document.createElement("button");
        card.className = "memory-card";
        card.type = "button";
        card.dataset.symbol = symbol;
        card.setAttribute("aria-label", "Hidden card");

        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">${symbol}</div>
            </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        gameGrid.appendChild(card);
        return card;
    });

    flippedCards = [];
    lockBoard = false;
    moveCount = 0;
    matches = 0;
    movesDisplay.textContent = "0";
    matchesDisplay.textContent = "0";
}

function flipCard(card) {
    if (lockBoard || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
        return;
    }

    card.classList.add("is-flipped");
    card.setAttribute("aria-label", "Revealed card");

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moveCount++;
        movesDisplay.textContent = moveCount;

        const [firstCard, secondCard] = flippedCards;

        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
            setTimeout(() => {
                firstCard.classList.add("is-matched");
                secondCard.classList.add("is-matched");
                firstCard.disabled = true;
                secondCard.disabled = true;
                flippedCards = [];
                matches++;
                matchesDisplay.textContent = matches;

                if (matches === symbols.length) {
                    setTimeout(() => {
                        createHearts(30);
                        alert("You matched all the love symbols! 💕");
                    }, 400);
                }
            }, 400);
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove("is-flipped");
                secondCard.classList.remove("is-flipped");
                firstCard.setAttribute("aria-label", "Hidden card");
                secondCard.setAttribute("aria-label", "Hidden card");
                flippedCards = [];
                lockBoard = false;
            }, 900);
        }
    }
}

if (restartBtn) {
    restartBtn.addEventListener("click", createGame);
}

createGame();