export function generateTicketOptions(event) {

    let optionsArray = [];
    let eventTickets = event.ticketCategories;
    eventTickets.forEach(ticket => optionsArray.push(ticket.description));
  
    let optionsMarkup = '';
  
    for (const optionValue of optionsArray) {
      optionsMarkup += `<option value="${optionValue}">${optionValue}</option>`;
    }
  
    return optionsMarkup;
  }
  