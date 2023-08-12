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
  
export function generateEventTypeOptions(events) {

  let optionsSet = new Set(events.map((event) => event.eventType));
  let optionsMarkup = '<option value="">Event type...</option>';

  for (const optionValue of optionsSet) {
    optionsMarkup += `<option value="${optionValue}">${optionValue}</option>`;
  }

  return optionsMarkup;
}

export function generateVenueTypeOptions(events) {

  let optionsSet = new Set(events.map((event) => event.venue.type));
  let optionsMarkup = '<option value="">Venue type...</option>';

  for (const optionValue of optionsSet) {
    optionsMarkup += `<option value="${optionValue}">${optionValue}</option>`;
  }

  return optionsMarkup;
}

export function eventTypeSelectsSetUp(data)
{
  const eventTypeSelect = document.getElementById('event-type-select');
  const venueTypeSelect = document.getElementById('venue-type-select');
  eventTypeSelect.innerHTML = generateEventTypeOptions(data);
  venueTypeSelect.innerHTML = generateVenueTypeOptions(data);

}

export function eventTypeSelectsReset()
{
  const eventTypeSelect = document.getElementById('event-type-select');
  const venueTypeSelect = document.getElementById('venue-type-select');
  eventTypeSelect.value = eventTypeSelect.options[0].value;
  venueTypeSelect.value = venueTypeSelect.options[0].value;
}

