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

// Selecting form, order list, and total dozens sold element
const orderForm = document.getElementById("orderForm");
const orderList = document.getElementById("orderList");
const totalDozensElement = document.getElementById("totalDozens");

// Variable to keep track of total dozens sold
let totalDozensSold = 0;

// Function to create a new order item HTML
function createOrderItem(order) {
  const orderItem = document.createElement("div");
  orderItem.classList.add("order-item");
  orderItem.dataset.id = order.id; // Assigning an ID to the order item

  // HTML for order item
  orderItem.innerHTML = `
            <p><strong>Pickup Date:</strong> ${order.pickupDate}</p>
            <p><strong>Pickup Time:</strong> ${formatTime(order.pickupTime)}</p>
            <p><strong>Type of Tamale:</strong> ${order.tamaleType.join(
              ", "
            )}</p>
            <p><strong>Temperature:</strong> ${order.temperature}</p>
            <p><strong>Dozens:</strong> ${order.dozens}</p>
            <p><strong>Customer Name:</strong> ${order.customerName}</p>
            <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
            <label>
                <input type="checkbox" ${order.fulfilled ? "checked" : ""}>
                <span class="fulfilled-label">Picked Up</span>
            </label>
            <button class="delete-btn">Delete</button>
        `;

  // Adding event listener to delete button
  const deleteBtn = orderItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => deleteOrder(order.id));

  return orderItem;
}

// Function to render orders
function renderOrders(orders) {
  orderList.innerHTML = ""; // Clearing existing order list
  orders.forEach((order) => {
    const orderItem = createOrderItem(order);
    orderList.appendChild(orderItem);
  });
}

// Sample initial orders (for testing purposes)
let orders = [];

// Render initial orders
renderOrders(orders);

// Function to add a new order
function addOrder(order) {
  orders.push(order);
  renderOrders(orders);
  totalDozensSold += order.dozens;
  totalDozensElement.textContent = `Total Dozens Sold: ${totalDozensSold}`;
}

// Function to delete an order
function deleteOrder(orderId) {
  orders = orders.filter((order) => order.id !== orderId);
  renderOrders(orders);
  // Recalculate total dozens sold
  totalDozensSold = orders.reduce((total, order) => total + order.dozens, 0);
  totalDozensElement.textContent = `Total Dozens Sold: ${totalDozensSold}`;
}

// Function to format time from 24-hour format to 12-hour format with AM/PM
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
}

// Submit event handler for adding new order
function handleSubmit(event) {
  event.preventDefault();
  const newOrder = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    pickupDate: document.getElementById("pickupDate").value,
    pickupTime: document.getElementById("pickupTime").value,
    tamaleType: [
      ...(document.getElementById("pork").checked ? ["Pork"] : []),
      ...(document.getElementById("cheesePeppers").checked
        ? ["Cheese and Peppers"]
        : []),
    ],
    temperature: document.getElementById("temperature").value,
    dozens: parseInt(document.getElementById("dozens").value),
    customerName: document.getElementById("customerName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    fulfilled: false, // Default to false for new orders
  };
  addOrder(newOrder);
  orderForm.reset();
}

orderForm.addEventListener("submit", handleSubmit);
