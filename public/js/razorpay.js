document.addEventListener("DOMContentLoaded", () => {
  const rzpBtn = document.getElementById("rzp-button");
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const amountText = document.getElementById("final-amount-text");

  if (!rzpBtn || !checkinInput || !checkoutInput) return;

  const pricePerDay = parseFloat(rzpBtn.getAttribute("data-price"));

  function calculateDays(checkin, checkout) {
    const inDate = new Date(checkin);
    const outDate = new Date(checkout);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.floor(diff));
  }

  function updateAmountText() {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;

    if (checkin && checkout) {
      const days = calculateDays(checkin, checkout);
      const baseAmount = pricePerDay * days;
      const finalAmount = Math.round(baseAmount * 1.18); 

      amountText.innerText = `Total Amount (GST included): ₹${finalAmount.toLocaleString("en-IN")}`;
      rzpBtn.setAttribute("data-amount", finalAmount);
    }
  }

  checkinInput.addEventListener("change", updateAmountText);
  checkoutInput.addEventListener("change", updateAmountText);

  rzpBtn.addEventListener("click", async function () {
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);
    const now = new Date();

    if (!checkinInput.value || !checkoutInput.value || checkin >= checkout) {
      alert("Please select a valid check-in and check-out date range.");
      return;
    }

    if (checkin < now || checkout < now) {
      alert("Dates cannot be in the past.");
      return;
    }

    const amount = parseInt(rzpBtn.getAttribute("data-amount"));
    const listingId = rzpBtn.getAttribute("data-listing-id");
    const key = rzpBtn.getAttribute("data-key");

    if (!amount || isNaN(amount)) {
      alert("Invalid amount. Please check dates again.");
      return;
    }

    const response = await fetch("/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Order creation failed:", errorText);
      alert("Payment initiation failed. Try again.");
      return;
    }

    const data = await response.json();

    const options = {
      key,
      amount: data.amount,
      currency: data.currency,
      name: "Easy Stay Booking",
      description: "Stay Booking (incl. 18% GST)",
      order_id: data.orderId,
      handler: function (response) {
        fetch(`/listings/${listingId}/book`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id
          })
        }).then(() => {
          alert("Booking successful!");
          window.location.href = `/listings/${listingId}`;
        });
      },
      theme: { color: "#3399cc" }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
});
