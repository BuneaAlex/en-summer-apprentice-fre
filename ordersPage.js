import { useStyles } from "./src/components/styles";
import { getEventById } from "./src/api_calls/events_calls";
import { generateTicketOptions } from './helperFunctions';
import { DeleteOrder } from "./src/api_calls/orders_calls";

export function addOrders(orderData)
{
  const ordersContainer = document.querySelector('.orders');
  orderData.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card', 'rounded-lg', 'bg-gray-200', 'p-4','m-4');

    const eventDescription = document.createElement('div');
    eventDescription.classList.add('event-description');

    const orderActions = document.createElement('div');
    orderActions.classList.add('order-actions');

    const ticketCategorySelect = document.createElement('select');
    ticketCategorySelect.classList.add('ticket-category');

    getEventById(order.eventID).then(data => 
      {
        eventDescription.innerHTML=addEventDescription(data,order)
        const ticketOptions = generateTicketOptions(data);
        ticketCategorySelect.innerHTML = ticketOptions;
        const ticketType = order.ticketCategory.description;
        const ticketOption = ticketCategorySelect.querySelector(`option[value=${ticketType}]`);
        ticketOption.selected = true;
        ticketCategorySelect.setAttribute('data-initial-value', ticketType);
      }
      
      )
    orderCard.appendChild(eventDescription);

    const ticketNumberSelectDiv = document.createElement('div');
    ticketNumberSelectDiv.classList.add("ticket-number-select");

    const ticketsLabel = document.createElement('label');
    ticketsLabel.setAttribute('for', 'tickets');
    ticketsLabel.textContent = 'Number of tickets:';

    const ticketsInput = document.createElement('input');
    ticketsInput.type = 'number';
    ticketsInput.name = 'tickets';
    ticketsInput.value = order.numberOfTickets;
    ticketsInput.min = '1';
    ticketsInput.max = '10';
    ticketsInput.setAttribute('data-initial-value', order.numberOfTickets);

    ticketNumberSelectDiv.appendChild(ticketsLabel);
    ticketNumberSelectDiv.appendChild(ticketsInput);


    const deleteButton = document.createElement('button');
    deleteButton.classList.add(...useStyles('standard_button'));
    deleteButton.classList.add('delete-order-btn');
    deleteButton.textContent = 'Delete';

    const updateButton = document.createElement('button');
    updateButton.classList.add('update-order-btn');
    updateButton.classList.add(...useStyles('disabled_button'))
    updateButton.textContent = 'Update';
    updateButton.disabled = true;
      
    orderActions.appendChild(deleteButton);
    orderActions.appendChild(ticketCategorySelect);
    orderActions.appendChild(ticketNumberSelectDiv);
    orderActions.appendChild(updateButton);

    orderCard.appendChild(orderActions);

    ordersContainer.appendChild(orderCard);

    ticketCategorySelect.addEventListener("change",() => {
      
      orderChangeHandler(ticketCategorySelect,ticketsInput,updateButton);
    });

    ticketsInput.addEventListener("change",() => {
      orderChangeHandler(ticketCategorySelect,ticketsInput,updateButton);
    });

    deleteButton.addEventListener("click", () => {
      DeleteOrder(order.orderID).then(data => console.log("deleted",data));
      ordersContainer.removeChild(orderCard);
    });

  });
  
}

function orderChangeHandler(ticketCategorySelect,ticketsInput,updateButton)
{
      const initialValueSelect = ticketCategorySelect.getAttribute("data-initial-value");
      const initialValueTicketsInput = ticketsInput.getAttribute("data-initial-value");
      const currentValueSelect = ticketCategorySelect.value;
      const currentValueTicketsInput = ticketsInput.value;

      if(initialValueSelect !== currentValueSelect || initialValueTicketsInput !== currentValueTicketsInput)
      {
        updateButton.classList.remove(...useStyles('disabled_button'));
        updateButton.classList.add(...useStyles('standard_button'));
        updateButton.disabled = false;
      }
      else{
        updateButton.classList.remove(...useStyles('standard_button'));
        updateButton.classList.add(...useStyles('disabled_button'));
        updateButton.disabled = true;
      }
}

function addEventDescription(eventData,order)
{
    return `
        <p>Event:${eventData.name}</p>
        <p>Type:${eventData.eventType}</p>
        <p>Venue:${eventData.venue.location}</p>
        <p>Date: ${eventData.startDate} - ${eventData.endDate}</p>
        <p>Price: ${order.totalPrice}$</p>
   `

}
