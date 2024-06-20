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
        <p><strong>Pickup Time:</strong> ${order.pickupTime}</p>
        <p><strong>Type of Tamale:</strong> ${order.tamaleType.join(", ")}</p>
        <p><strong>Temperature:</strong> ${order.temperature}</p>
        <p><strong>Dozens:</strong> ${order.dozens}</p>
        <p><strong>Customer Name:</strong> ${order.customerName}</p>
        <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
        <label>
            <input type="checkbox" ${order.fulfilled ? "checked" : ""}>
            <span class="fulfilled-label">Picked Up</span>
        </label>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

  // Adding event listeners to edit and delete buttons
  const editBtn = orderItem.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => editOrder(order.id));

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

// Function to edit an order
function editOrder(orderId) {
  const orderToEdit = orders.find((order) => order.id === orderId);
  if (!orderToEdit) return;

  // Fill form with existing order details for editing
  document.getElementById("pickupDate").value = orderToEdit.pickupDate;
  document.getElementById("pickupTime").value = orderToEdit.pickupTime;
  document.getElementById("temperature").value = orderToEdit.temperature;
  document.getElementById("dozens").value = orderToEdit.dozens;
  document.getElementById("customerName").value = orderToEdit.customerName;
  document.getElementById("phoneNumber").value = orderToEdit.phoneNumber;
  document.getElementById("pork").checked =
    orderToEdit.tamaleType.includes("Pork");
  document.getElementById("cheesePeppers").checked =
    orderToEdit.tamaleType.includes("Cheese and Peppers");

  // Remove the order from the list temporarily for editing
  orders = orders.filter((order) => order.id !== orderId);
  renderOrders(orders);
  // Recalculate total dozens sold
  totalDozensSold = orders.reduce((total, order) => total + order.dozens, 0);
  totalDozensElement.textContent = `Total Dozens Sold: ${totalDozensSold}`;

  // Update form submit to handle edit mode
  orderForm.removeEventListener("submit", handleSubmit);
  orderForm.addEventListener("submit", function handleSubmit(event) {
    event.preventDefault();
    const updatedOrder = {
      id: orderId,
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
      fulfilled: orderToEdit.fulfilled, // Keep previous fulfillment status
    };
    addOrder(updatedOrder);
    orderForm.reset();
    orderForm.removeEventListener("submit", handleSubmit);
    orderForm.addEventListener("submit", handleSubmit);
  });
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
