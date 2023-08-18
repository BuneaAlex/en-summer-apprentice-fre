import { useStyles } from "./src/components/styles";
import { getEventById } from "./src/api_calls/events_calls";
import { generateTicketOptions } from './helperFunctions';
import { deleteOrder, updateOrder } from "./src/api_calls/orders_calls";
import { genericSortElements } from "./genericDivSort";

export function addOrders(orderData)
{
  const ordersContainer = document.querySelector('.orders');
  ordersContainer.innerHTML = '';
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
        orderCard.insertBefore(eventDescription,orderCard.firstChild);
      }
      
      )
    

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
      deleteOrder(order.orderID).then(data => 
        {
          ordersContainer.removeChild(orderCard);
        });
    });

    updateButton.addEventListener("click", () => {
      const numberOfTickets = ticketsInput.value;
      const ticketCategory = ticketCategorySelect.value;
      const patchRequestBody = {
        numberOfTickets: numberOfTickets,
        ticketType: ticketCategory
      }
      updateOrder(order.orderID,patchRequestBody)
      .then(response => {

        if (response.ok) {

            response.json().then(data => {
              ticketsInput.setAttribute('data-initial-value', data.numberOfTickets);
              ticketCategorySelect.setAttribute('data-initial-value', data.ticketCategory.description);
              disableButton(updateButton);
              let priceParagraph = eventDescription.querySelector('p:nth-child(5)');
              priceParagraph.innerHTML = "Price:" +  data.totalPrice + "$";
              toastr.success('Success!');
            })   

        } else {
          response.json().then(errorData => {
            toastr.warning(errorData.errorMessage);
          });
        }  
        
      });
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
        enableButton(updateButton);
      }
      else{
        disableButton(updateButton);
      }
}

function disableButton(button)
{
    button.classList.remove(...useStyles('standard_button'));
    button.classList.add(...useStyles('disabled_button'))
    button.disabled = true;
}

function enableButton(button)
{
    button.classList.remove(...useStyles('disabled_button'));
    button.classList.add(...useStyles('standard_button'));
    button.disabled = false;
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


export function sortButtonsSetUp()
{
    var sortOrdersByPriceButton = document.getElementById("sort-price-order");
    sortOrdersByPriceButton.addEventListener('click',() => {
      const sortAscIcon = document.getElementById('sort-asc-price-order');
      const sortDescIcon = document.getElementById('sort-desc-price-order');

      if(!sortAscIcon.classList.contains('hidden-icon'))
      {
          sortOrdersByPrice(true);
      }
      else
      {
          sortOrdersByPrice(false);
      }

      sortAscIcon.classList.toggle('hidden-icon');
      sortDescIcon.classList.toggle('hidden-icon');
      
    })


    var sortOrdersByNameButton = document.getElementById("sort-name-order");
    sortOrdersByNameButton.addEventListener('click',() => {
      const sortAscIcon = document.getElementById('sort-asc-name-order');
      const sortDescIcon = document.getElementById('sort-desc-name-order');

      if(!sortAscIcon.classList.contains('hidden-icon'))
      {
          sortOrdersByName(true);
      }
      else
      {
          sortOrdersByName(false);
      }

      sortAscIcon.classList.toggle('hidden-icon');
      sortDescIcon.classList.toggle('hidden-icon');
      
    })

}

function getPrice(orderCard)
{
  const eventDescription = orderCard.querySelector('.event-description');
  const priceParagraph = eventDescription.querySelector('p:nth-child(5)');
  const priceString = priceParagraph.innerHTML;
  const priceValue = parseInt(priceString.split(' ')[1]);
  return priceValue;
}

function sortOrdersByPrice(ascending)
{
  const orderCards = document.getElementsByClassName('order-card');
  const orderCardsArray = [...orderCards];
  genericSortElements(orderCardsArray,getPrice,ascending);
}


function getName(orderCard)
{
  const eventDescription = orderCard.querySelector('.event-description');
  const nameParagraph = eventDescription.querySelector('p:nth-child(1)');
  const nameString = nameParagraph.innerHTML;
  const nameValue = nameString.split(':')[1];
  return nameValue;
}

function sortOrdersByName(ascending)
{
  const orderCards = document.getElementsByClassName('order-card');
  const orderCardsArray = [...orderCards];
  genericSortElements(orderCardsArray,getName,ascending);
}

