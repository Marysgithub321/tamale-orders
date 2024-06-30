// Check if service workers are supported and register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (error) {
        console.log("ServiceWorker registration failed: ", error);
      }
    );
  });
}

// Selecting form, order list, and total dozens sold elements
const orderForm = document.getElementById("orderForm");
const orderList = document.getElementById("orderList");
const totalChiliColoradoElement = document.getElementById("totalChiliColorado");
const totalPeppersCheeseElement = document.getElementById("totalPeppersCheese");

// Initialize orders array with orders from localStorage or empty array
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Function to create a new order item HTML
function createOrderItem(order) {
  const orderItem = document.createElement("div");
  orderItem.classList.add("order-item");
  orderItem.dataset.id = order.id; // Assigning an ID to the order item

  // HTML for order item
  orderItem.innerHTML = `
    <p><strong>Pickup Date:</strong> ${order.pickupDate}</p>
    <p><strong>Pickup Time:</strong> ${formatTime(order.pickupTime)}</p>
    <p><strong>Chili Colorado:</strong> ${order.coloradoAmount} amount (${
    order.coloradoTemperature
  })</p>
    <p><strong>Peppers and Cheese:</strong> ${order.cheeseAmount} amount (${
    order.cheeseTemperature
  })</p>
    <p><strong>Customer Name:</strong> ${order.customerName}</p>
    <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
    <label>
      <input type="checkbox" ${
        order.fulfilled ? "checked" : ""
      } onchange="toggleFulfilled(${order.id})">
      <span class="fulfilled-label">Picked Up</span>
    </label>
    <button class="delete-btn" onclick="deleteOrder(${
      order.id
    })">Delete</button>
  `;

  return orderItem;
}

// Function to render orders
function renderOrders() {
  orderList.innerHTML = ""; // Clearing existing order list
  let totalChiliColorado = 0;
  let totalPeppersCheese = 0;

  orders.forEach((order) => {
    const orderItem = createOrderItem(order);
    orderList.appendChild(orderItem);

    // Update totals based on tamale type
    totalChiliColorado += order.coloradoAmount;
    totalPeppersCheese += order.cheeseAmount;
  });

  // Update total ordered for each type
  totalChiliColoradoElement.textContent = `Total Chili Colorado Ordered: ${totalChiliColorado}`;
  totalPeppersCheeseElement.textContent = `Total Peppers and Cheese Ordered: ${totalPeppersCheese}`;
}

// Function to format time from 24-hour format to 12-hour format with AM/PM
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const newOrder = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    pickupDate: document.getElementById("pickupDate").value,
    pickupTime: document.getElementById("pickupTime").value,
    coloradoAmount: parseInt(
      document.getElementById("coloradoAmount").value,
      10
    ),
    coloradoTemperature: document.getElementById("coloradoTemperature").value,
    cheeseAmount: parseInt(document.getElementById("cheeseAmount").value, 10),
    cheeseTemperature: document.getElementById("cheeseTemperature").value,
    customerName: document.getElementById("customerName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    fulfilled: false, // Default to false for new orders
  };
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  orderForm.reset();
}

// Function to delete an order
function deleteOrder(orderId) {
  orders = orders.filter((order) => order.id !== orderId);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

// Function to toggle order fulfillment status
function toggleFulfilled(orderId) {
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    order.fulfilled = !order.fulfilled;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}

// Event listeners
orderForm.addEventListener("submit", handleSubmit);

// Initial render of orders on page load
renderOrders();
