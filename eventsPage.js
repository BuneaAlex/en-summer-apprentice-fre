import { addOrder } from "./src/api_calls/orders_calls";
import { generateTicketOptions, eventTypeSelectsReset } from './helperFunctions';
import { useStyles } from "./src/components/styles";
import { getEventsFiltered } from "./src/api_calls/events_calls";

export function addEvents(eventData) {
    const eventsContainer = document.querySelector('.events');
    eventsContainer.innerHTML = '';
    eventData.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card','rounded-lg', 'bg-gray-200', 'p-4','m-4');
      
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
      ticketCategorySelect.classList.add('ticket-category');
  
      const ticketOptions = generateTicketOptions(event);
      ticketCategorySelect.innerHTML = ticketOptions;
  
      const ticketNumberSelectDiv = document.createElement('div');
      ticketNumberSelectDiv.classList.add("ticket-number-select");
  
      const ticketsLabel = document.createElement('label');
      ticketsLabel.setAttribute('for', 'tickets');
      ticketsLabel.textContent = 'Number of tickets:';
  
      const ticketsInput = document.createElement('input');
      ticketsInput.type = 'number';
      ticketsInput.name = 'tickets';
      ticketsInput.value = '0';
      ticketsInput.min = '1';
      ticketsInput.max = '100';
  
      const priceLabel = document.createElement('p');
      priceLabel.textContent = 'Price:-';
      priceLabel.classList.add("price-label");
  
      const buyButton = document.createElement('button');
      buyButton.classList.add(...useStyles('standard_button'));
      buyButton.classList.add('buy-ticket-btn');
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
        modifyPrice(event,ticketCategorySelect,ticketsInput,priceLabel);
      });
  
      ticketsInput.addEventListener("change",() => {
        modifyPrice(event,ticketCategorySelect,ticketsInput,priceLabel);
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
          addOrder(order).then(
            response => {
              if (response.ok) {
                
                ticketsInput.value = 0;
                priceLabel.innerText = "Price:-";
                toastr.success('Success!');
              } else {
                response.json().then(errorData => {
                  alert(errorData.message);
                });
                
              }
            }
          )   
        }  
         catch (error) {
          console.error('Error adding order:', error);
        }
      });
  
  
    });
  
  }
  
  
function modifyPrice(eventObject,ticketCategorySelect,ticketsInput,priceLabel) {
  
  const selectedTicketCategory = ticketCategorySelect.value;
  const selectedTicketNumber = ticketsInput.value;
  const ticketList = eventObject['ticketCategories'];
  let price = 0;
  ticketList.forEach(ticket => {if(ticket.description === selectedTicketCategory) price = ticket.price;})
  priceLabel.innerText = "Price:" + selectedTicketNumber*price;
}

export function filterEventByTypes()
{
    const eventTypeSelect = document.getElementById('event-type-select');
    const venueTypeSelect = document.getElementById('venue-type-select');

    const eventType = eventTypeSelect.value;
    const venueType = venueTypeSelect.value;

    getEventsFiltered(eventType,venueType)
    .then(data => addEvents(data)) 
}

export function eventTypeSelectsListenerSetUp()
{
  const eventTypeSelect = document.getElementById('event-type-select');
  const venueTypeSelect = document.getElementById('venue-type-select');

  eventTypeSelect.addEventListener("change",() => {
    setTimeout(() => {
      filterEventByTypes();
    },500)
    
  });

  venueTypeSelect.addEventListener("change",() => {
    setTimeout(() => {
      filterEventByTypes();
    },500)
  });
}

export function eventNameFilterSetUp(events)
{
  const filterField = document.getElementById('filter_event_name');

  if(filterField)
  {
      const filterInterval = 500;
      filterField.addEventListener('keyup',() => {

        eventTypeSelectsReset();

        setTimeout( () => {
          const filterValue = filterField.value;

          if(filterValue !== undefined && events !== undefined)
          {
              const filteredEvents = events.filter((event) => event.name.toLowerCase().includes(filterValue.toLowerCase()));
              addEvents(filteredEvents);
          }
        }, filterInterval);
      })
  }
}

  