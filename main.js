import { getAllEvents } from "./src/api_calls/events_calls";
import { getAllOrders } from "./src/api_calls/orders_calls";
import { addLoader, removeLoader, removeLoaderForLogin } from "./src/components/loader";
import { useStyles } from "./src/components/styles";
import { addOrders, sortButtonsSetUp } from "./ordersPage";
import { addEvents, eventNameFilterSetUp, eventTypeSelectsListenerSetUp } from "./eventsPage";
import { eventTypeSelectsSetUp } from "./helperFunctions";

const loaderTime = 1000;
let events = [];
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
    <div class="event-filters">
      <input
        type="text"
        placeholder="Filter by event name"
        id="filter_event_name"
      />
      <select id="event-type-select">

      </select>

      <select id="venue-type-select">

      </select>
    </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
  
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="order-actions"> 
          <button id="sort-price-order">
          Price
          <i class="fa-solid fa-arrow-up-wide-short" id="sort-asc-price-order"></i>
          <i class="fa-solid fa-arrow-down-short-wide hidden-icon" id="sort-desc-price-order"></i>
          </button>
      </div>
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
    <button type="button" id="loginButton">
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

  addLoader();

  getAllEvents()
  .then(data => {
    eventTypeSelectsSetUp(data);
    eventNameFilterSetUp(data);
    addEvents(data)
  }).finally(
    setTimeout(() => {
    removeLoader();
  },loaderTime));

  eventTypeSelectsListenerSetUp();
}


function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
 
  addLoader();

  getAllOrders()
  .then(data => {
    addOrders(data)
  })
  .finally(
    setTimeout(() => {
    removeLoader();
  },loaderTime))

  sortButtonsSetUp();

  
}




function renderLoginPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getLoginPageTemplate();
  removeLoaderForLogin();
  var loginButton = document.getElementById("loginButton");
  loginButton.classList.add(...useStyles('standard_button'));
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
