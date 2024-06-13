//---------------- Global Vars-------------------------------

var texts = ["Please", "Enter Your Name!"];

const morphTime = 1;
const cooldownTime = 1.5;
let frames = 0;
let inf_animation = false;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

//---------------- Initialize Text Spans-----------------------

const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");

text1.textContent = texts[textIndex % texts.length];
text2.textContent = texts[(textIndex + 1) % texts.length];

//----------------- Morphing Metho----------------------------

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

function setMorph(fraction) {
  text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  text1.textContent = texts[textIndex % texts.length];
  text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;

  text2.style.filter = "";
  text2.style.opacity = "100%";

  text1.style.filter = "";
  text1.style.opacity = "0%";
}

//-------------- Controller Function -------------------------

function animate() {
  if (inf_animation || frames < 400) {
    if (!inf_animation) frames = requestAnimationFrame(animate);
    else requestAnimationFrame(animate);
  }

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }

    doMorph();
  } else {
    doCooldown();
  }
}

// Debounce input

const inputField = document.getElementById("inp");
let typingTimer;
const doneTypingInterval = 1000;

inputField.addEventListener("keyup", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

inputField.addEventListener("keydown", () => {
  clearTimeout(typingTimer);
});

function doneTyping() {
  texts = ["Hi " + inputField.value + "!", "Nice To Meet You!"];
  inf_animation = true;
  animate();
}

// Start

window.onload = () => {
  animate();
};
