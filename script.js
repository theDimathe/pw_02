const promoDiscount = document.getElementById("promo-discount");
const totalPrice = document.getElementById("total-price");
const toast = document.getElementById("bonus-status");
const confirmBtn = document.getElementById("confirm-btn");
const form = document.getElementById("payment-form");

const basePrice = 29.99;
let currentDiscount = 15;

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const updateTotal = () => {
  const total = Math.max(basePrice - currentDiscount, 0);
  totalPrice.textContent = formatCurrency(total);
  promoDiscount.textContent = `-${formatCurrency(currentDiscount)}`;
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("toast--visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2400);
};

const validateForm = () => {
  const cardNumber = form.cardNumber.value.replace(/\s+/g, "");
  const cardExpiry = form.cardExpiry.value.trim();
  const cardCvc = form.cardCvc.value.trim();
  const country = form.country.value;

  const isValid =
    /^\d{16}$/.test(cardNumber) &&
    /^\d{2}\/\d{2}$/.test(cardExpiry) &&
    /^\d{3}$/.test(cardCvc) &&
    Boolean(country);

  confirmBtn.disabled = !isValid;
};

form.addEventListener("input", validateForm);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Processing...";
  showToast("Securing your bonus...");

  setTimeout(() => {
    confirmBtn.textContent = "Confirm purchase";
    validateForm();
    showToast("Payment confirmed. Promo applied.");
  }, 1600);
});

updateTotal();
validateForm();
showToast("Bonus ready. Discount applied.");
