import { data } from "autoprefixer";
import { getAllEvents } from "./src/api_calls/events_calls";
import { addOrder } from "./src/api_calls/orders_calls";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="orders flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getLoginPageTemplate() {
  return `<div>
  <form>
    <div class="login-container">
    <h2>Login form</h2>
    <input
      type="text"
      placeholder="Email"
      id="email"
    />
    <input
      type="password"
      placeholder="Password"
      id="password"
    />
    <button type="button" class="standard-btn" id="loginButton">
      Login
    </button>
    </div>
  </form>
</div>`
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent('/login');
}


function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data

  getAllEvents().then(data => {addEvents(data)});
  
}

function addEvents(eventData) {
  const eventsContainer = document.querySelector('.events');

  eventData.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    
    const contentMarkup = `

      <div class="event-overview">
      <h2 class="event-title text-2xl font-bold">${event.name}</h2>
      <img src="${event.image}" alt="${event.name}" class="event-image">
      </div>

      <div class="event-details">
      <p class="description text-gray-700">${event.description}</p>
      <p>Event Type: ${event.eventType}</p>
      <p>Date: ${event.startDate} - ${event.endDate}</p>
      </div>

      <div class="event-venue">
        <p>Venue: ${event.venue.location}</p>
        <p>Capacity: ${event.venue.capacity}</p>
        <p>Type: ${event.venue.type}</p>
      </div>
  `;
    const eventBuyDiv = document.createElement('div');
    eventBuyDiv.classList.add('event-buy');

    const ticketCategorySelect = document.createElement('select');

    const ticketOptions = generateTicketOptions(event);
    ticketCategorySelect.innerHTML = ticketOptions;

    const ticketNumberSelectDiv = document.createElement('div');

    const ticketsLabel = document.createElement('label');
    ticketsLabel.setAttribute('for', 'tickets');
    ticketsLabel.textContent = 'Number of tickets:';

    const ticketsInput = document.createElement('input');
    ticketsInput.type = 'number';
    ticketsInput.name = 'tickets';
    ticketsInput.value = '1';
    ticketsInput.min = '1';
    ticketsInput.max = '10';

    const priceLabel = document.createElement('p');
    priceLabel.textContent = 'Price:';

    const buyButton = document.createElement('button');
    buyButton.classList.add('standard-btn');
    buyButton.textContent = 'Confirm purchase';

    // Append elements to their respective parent elements
    ticketNumberSelectDiv.appendChild(ticketsLabel);
    ticketNumberSelectDiv.appendChild(ticketsInput);

    eventBuyDiv.appendChild(ticketCategorySelect);
    eventBuyDiv.appendChild(ticketNumberSelectDiv);
    eventBuyDiv.appendChild(priceLabel);
    eventBuyDiv.appendChild(buyButton);

    eventCard.innerHTML = contentMarkup;
    eventCard.appendChild(eventBuyDiv);
    eventsContainer.appendChild(eventCard);


    ticketCategorySelect.addEventListener("change",() => {

    });

    ticketsInput.addEventListener("change",() => {

    });

    buyButton.addEventListener("click",async () => {
      const selectedTicketCategory = ticketCategorySelect.value;
      const selectedTicketNumber = ticketsInput.value;
    
      const ticketList = event['ticketCategories'];
      let ticketCategoryId = -1;
      ticketList.forEach(ticket => {if(ticket.description === selectedTicketCategory) ticketCategoryId = ticket.id;})
    
      let order = {
        eventID: event.eventID,
        ticketCategoryID: ticketCategoryId,
        numberOfTickets: parseInt(selectedTicketNumber)
      }
    
      try {
        await addOrder(order).then(data => alert('Order added successfully:' + JSON.stringify(data)));
      } catch (error) {
        console.error('Error adding order:', error);
      }
    });


  });

  //eventsContainer.addEventListener('click', handleEventContainerClick);
}

function generateTicketOptions(event) {

  let optionsArray = [];
  let eventTickets = event.ticketCategories;
  eventTickets.forEach(ticket => optionsArray.push(ticket.description));

  let optionsMarkup = '';

  for (const optionValue of optionsArray) {
    optionsMarkup += `<option value="${optionValue}">${optionValue}</option>`;
  }

  return optionsMarkup;
}

function modifyPrice(eventObject) {
  const ticketCategorySelect = document.getElementById('ticket-category');
  const priceLabel = document.getElementById('price-label');
  const selectedTicketCategory = ticketCategorySelect.value;
  const ticketsInput = document.getElementById('tickets');
  const selectedTicketNumber = ticketsInput.value;
  const ticketList = eventObject['ticketCategories'];
  let price = 0;
  ticketList.forEach(ticket => {if(ticket.description === selectedTicketCategory) price = ticket.price;})
  priceLabel.innerText = "Price:" + selectedTicketNumber*price;
}

function handleTicketNumberChange(eventObject) {
  modifyPrice(eventObject);
}

function handleTicketCategoryChange(eventObject) {
  modifyPrice(eventObject);
}

async function handleTicketPurchase(eventObject) {
  const ticketCategorySelect = document.getElementById('ticket-category');
  const selectedTicketCategory = ticketCategorySelect.value;
  const ticketsInput = document.getElementById('tickets');
  const selectedTicketNumber = ticketsInput.value;

  const ticketList = eventObject['ticketCategories'];
  let ticketCategoryId = -1;
  ticketList.forEach(ticket => {if(ticket.description === selectedTicketCategory) ticketCategoryId = ticket.id;})

  let order = {
    eventID: eventObject.eventID,
    ticketCategoryID: ticketCategoryId,
    numberOfTickets: parseInt(selectedTicketNumber)
  }

  try {
    await addOrder(order).then(data => alert('Order added successfully:' + JSON.stringify(data)));
    
  } catch (error) {
    console.error('Error adding order:', error);
  }
}

// Assuming you have a function to fetch eventData using getAllEvents()
getAllEvents().then(data => {
  eventData = data;
  addEvents(eventData);
});


function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const orderData =  {
    orderID: 1,
    eventID: 1,
    ticketCategory: {
        id: 1,
        description: "Standard",
        price: 800.0
    },
    orderedAt: "2023-03-18 10:00:00",
    numberOfTickets: 2,
    totalPrice: 1600.0
  }

  const eventData = {
    eventID: 1,
    venue: {
        type: "Stadion",
        capacity: 1000,
        location: "Aleea Stadionului 2, Cluj-Napoca"
    },
    eventType: "Festival de Muzica",
    name: "Untold",
    description: "Muzica Electronica si nu numai",
    startDate: "2023-07-18 10:00:00",
    endDate: "2023-07-22 23:59:59",
    ticketCategories: [
        {
            id: 1,
            description: "Standard",
            price: 800.0
        },
        {
            id: 5,
            description: "VIP",
            price: 1500.0
        }
    ],
    image: "https://play-lh.googleusercontent.com/ypVb0U7-YUPC3JqDyC9vEeeNNWxTxXVPeFZPLwMcVuUXrYFx2xJQxq3jBsyu8Dd1WQQ"
}

  const orderCard = document.createElement('div');
  orderCard.classList.add('order-card');
  // Create the event content markup
  const contentMarkup = `
      <div class="event-description">
          <p>Event:${eventData.name}</p>
          <p>Type:${eventData.eventType}</p>
          <p>Venue:${eventData.venue.location}</p>
          <p>Date: ${eventData.startDate} - ${eventData.endDate}</p>
          <p>Price: ${orderData.totalPrice}$</p>
      </div>
      
      <div class="order-actions">

      <button id="delete-order-btn" class="standard-btn">Delete</button>

        <select id="ticket-category">
          <option value="Standard" selected>Standard</option>
          <option value="VIP">VIP</option>
        </select>

        <div id="ticket-number-select">
        <label for="tickets">Number of tickets:</label>
        <input type="number" id="tickets" name="tickets" value="1" min="1" max="10">
        </div>

        
        <button id="update-order-btn" class="standard-btn">Update</button>
      </div>

  `;

  orderCard.innerHTML = contentMarkup;
  const ordersContainer = document.querySelector('.orders');
  // Append the event card to the events container
  ordersContainer.appendChild(orderCard);
}

function renderLoginPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getLoginPageTemplate();
  var loginButton = document.getElementById("loginButton");
  var menuNav = document.getElementsByTagName("nav")[0];
  if (menuNav) {
    menuNav.style.display = "none";
  }

  // Add event listener to the login button
  loginButton.addEventListener("click", handleLogin);

}

async function handleLogin()
{
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  try {
    const response = await fetch('http://localhost:8080/management/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Login successful', responseData);
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      navigateTo("/"); 
      var menuNav = document.getElementsByTagName("nav")[0];
      if (menuNav) {
        menuNav.style.display = "";
      }
      

    } else {
      console.error('Login error:', response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }else if(url === '/login') {
    renderLoginPage();
  }
  
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
//navigateTo("/login");
