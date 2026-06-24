const cards = Array.from(document.querySelectorAll(".work-card"));
const prevButton = document.querySelector("#prevWork");
const nextButton = document.querySelector("#nextWork");
const progressBar = document.querySelector("#progressBar");
const form = document.querySelector(".booking-form");

let activeIndex = 0;

function renderCarousel() {
  cards.forEach((card, index) => {
    card.classList.toggle("is-active", index === activeIndex);
  });
  progressBar.style.width = `${((activeIndex + 1) / cards.length) * 100}%`;
}

function moveCarousel(direction) {
  activeIndex = (activeIndex + direction + cards.length) % cards.length;
  renderCarousel();
}

prevButton.addEventListener("click", () => moveCarousel(-1));
nextButton.addEventListener("click", () => moveCarousel(1));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.textContent = "Availability Requested";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = "Request Availability";
    button.disabled = false;
    form.reset();
  }, 1800);
});

renderCarousel();
