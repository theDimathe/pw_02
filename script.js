const bonusMeter = document.getElementById("bonus-meter");
const bonusPercent = document.getElementById("bonus-percent");
const promoDiscount = document.getElementById("promo-discount");
const totalPrice = document.getElementById("total-price");
const bonusStatus = document.getElementById("bonus-status");
const applyBonusBtn = document.getElementById("apply-bonus");
const previewBonusBtn = document.getElementById("preview-bonus");
const statePanel = document.getElementById("state-panel");
const confirmBtn = document.getElementById("confirm-btn");
const form = document.getElementById("payment-form");

const basePrice = 29.99;
let currentDiscount = 0;
let bonusInterval;

const stateMessages = {
  idle: "Ready to complete payment. We'll verify details before confirming.",
  loading: "Checking payment details...",
  empty: "No active offers. Try refreshing the bonus.",
  error: "Couldn't confirm the bonus. Please try again.",
};

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const updateTotal = () => {
  const total = Math.max(basePrice - currentDiscount, 0);
  totalPrice.textContent = formatCurrency(total);
  promoDiscount.textContent = `- ${formatCurrency(currentDiscount)}`;
};

const updateBonusMeter = (value) => {
  bonusMeter.style.width = `${value}%`;
  bonusPercent.textContent = `${value}%`;
};

const runBonusAnimation = () => {
  let progress = 0;
  clearInterval(bonusInterval);
  bonusInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(bonusInterval);
      bonusStatus.textContent = "Bonus activated! Discount applied.";
      currentDiscount = 15;
      updateTotal();
    } else {
      bonusStatus.textContent = `Checking bonus... ${progress}%`;
    }
    updateBonusMeter(progress);
  }, 420);
};

const setPanelState = (state) => {
  statePanel.textContent = stateMessages[state];
  statePanel.dataset.state = state;
};

const validateForm = () => {
  const cardNumber = form.cardNumber.value.replace(/\s+/g, "");
  const cardExpiry = form.cardExpiry.value.trim();
  const cardCvc = form.cardCvc.value.trim();
  const country = form.country.value;
  const terms = form.terms.checked;

  const isValid =
    /^\d{16}$/.test(cardNumber) &&
    /^\d{2}\/\d{2}$/.test(cardExpiry) &&
    /^\d{3}$/.test(cardCvc) &&
    Boolean(country) &&
    terms;

  confirmBtn.disabled = !isValid;
};

form.addEventListener("input", validateForm);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Processing...";
  setPanelState("loading");

  setTimeout(() => {
    confirmBtn.textContent = "Confirm purchase";
    validateForm();
    setPanelState("idle");
    bonusStatus.textContent = "Payment confirmed. Promo applied.";
  }, 1800);
});

previewBonusBtn.addEventListener("click", () => {
  bonusStatus.textContent = "Checking available bonuses...";
  runBonusAnimation();
});

applyBonusBtn.addEventListener("click", () => {
  currentDiscount = 10;
  updateTotal();
  bonusStatus.textContent = "Discount applied manually.";
  updateBonusMeter(40);
});

const stateButtons = {
  "simulate-empty": "empty",
  "simulate-error": "error",
  "simulate-loading": "loading",
};

Object.entries(stateButtons).forEach(([buttonId, state]) => {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", () => {
    setPanelState(state);
    if (state === "loading") {
      bonusStatus.textContent = "Offer check in progress...";
    }
  });
});

setPanelState("idle");
updateTotal();
updateBonusMeter(0);
validateForm();
