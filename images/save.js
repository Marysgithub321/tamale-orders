<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tamale Order Tracker</title>
    <link rel="stylesheet" href="styles.css" />
    <!-- Link to your custom icon -->
    <link
      rel="icon"
      href="images/android-chrome-512x512.png"
      type="image/png"
    />
    <link rel="icon" href="images/apple-touch-icon.png" type="image/png" />
    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <div class="container">
      <h1>Tamale Order Tracker</h1>
      <div id="totalChiliColorado">Total Chili Colorado Ordered: 0</div>
      <div id="totalPeppersCheese">Total Peppers and Cheese Ordered: 0</div>

      <form id="orderForm">
        <label for="customerName">Customer Name:</label>
        <input type="text" id="customerName" name="customerName" required />
        <label for="phoneNumber">Phone Number:</label>
        <input type="text" id="phoneNumber" name="phoneNumber" required />

        <label for="pickupDate">Pickup Date:</label>
        <input type="date" id="pickupDate" name="pickupDate" required />

        <label for="pickupTime">Pickup Time:</label>
        <input type="time" id="pickupTime" name="pickupTime" required />

        <fieldset>
          <legend>Chili Colorado:</legend>
          <label for="coloradoDozens">Number of Tamales:</label>
          <input
            type="number"
            id="coloradoDozens"
            name="coloradoDozens"
            min="0"
            required
          />
          <label for="coloradoTemperature">Temperature:</label>
          <select id="coloradoTemperature" name="coloradoTemperature" required>
            <option value="hot">Hot</option>
            <option value="cold">Cold</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Peppers and Cheese:</legend>
          <label for="cheeseDozens">Number of Tamales:</label>
          <input
            type="number"
            id="cheeseDozens"
            name="cheeseDozens"
            min="0"
            required
          />
          <label for="cheeseTemperature">Temperature:</label>
          <select id="cheeseTemperature" name="cheeseTemperature" required>
            <option value="hot">Hot</option>
            <option value="cold">Cold</option>
          </select>
        </fieldset>

        <button type="submit">Add Order</button>
      </form>

      <div id="orderList">
        <!-- Orders will be dynamically added here -->
      </div>
    </div>

    <!-- Link to your main JavaScript file -->
    <script src="main.js"></script>
  </body>
</html>



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
    <p><strong>Chili Colorado:</strong> ${order.coloradoDozens} dozens (${
    order.coloradoTemperature
  })</p>
    <p><strong>Peppers and Cheese:</strong> ${order.cheeseDozens} dozens (${
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
    totalChiliColorado += order.coloradoDozens;
    totalPeppersCheese += order.cheeseDozens;
  });

  // Update total dozens sold for each type
  totalChiliColoradoElement.textContent = `Total Chili Colorado Sold: ${totalChiliColorado}`;
  totalPeppersCheeseElement.textContent = `Total Peppers and Cheese Sold: ${totalPeppersCheese}`;
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
    coloradoDozens: parseInt(
      document.getElementById("coloradoDozens").value,
      10
    ),
    coloradoTemperature: document.getElementById("coloradoTemperature").value,
    cheeseDozens: parseInt(document.getElementById("cheeseDozens").value, 10),
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


body {
  font-family: Arial, sans-serif;
  background-color: #e3cdab;
  color: #0dbd79;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.container {
  max-width: 600px;
  min-height: 100vh;
  padding: 20px;
  background-color: #e3cdab;
  border: 3px solid #c6695c;
  border-radius: 10px;
  text-align: center; /* Center align content inside container */
}

h1 {
  color: #d57c36;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 40px;
  font-weight: bolder;
}

form {
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #c6695c;
}

input[type="date"],
input[type="time"],
input[type="number"],
input[type="text"],
select,
button {
  width: calc(100% - 16px); /* Adjust width for padding */
  height: 40px; /* Set height for uniformity */
  padding: 8px;
  margin: 0 auto; /* Center align */
  border: 1px solid #e3cdab; /* Match background color */
  border-radius: 5px;
  box-sizing: border-box; /* Include padding and border in width calculation */
}

button {
  background-color: rgb(187, 13, 13);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #a81c1e;
}

#orderList {
  margin-top: 20px;
}

.order-item {
  background-color: #d57c36;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  position: relative; /* Positioning for absolute elements inside */
}

.order-item label {
  display: inline-block;
  margin-bottom: 5px;
}

.order-item input[type="checkbox"] {
  margin-left: 10px; /* Space between Delete button and checkbox */
  vertical-align: middle;
}

.order-item .fulfilled-label {
  color: #0dbd79; /* Green color for picked up checkbox text */
}

.order-item button {
  margin-left: 10px; /* Space between Edit and Delete buttons */
  width: 70px; /* Adjusted width for buttons */
}

#totalChiliColorado {
  font-size: 1.2rem;
  font-weight: bolder;
  margin-top: 20px;
  margin-bottom: 20px;
}

#totalPeppersCheese {
  font-size: 1.2rem;
  font-weight: bolder;
  margin-top: 20px;
  margin-bottom: 20px;
}
legend {
  font-weight: bolder;
}
