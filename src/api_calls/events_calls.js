import { JAVA_SERVER_EVENTS_BASE_URL} from "./consts";
import {authenticationHeaderSetter,status,json} from "./utils";

export function getAllEvents() 
{
    
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    let options = { method: 'GET',
    headers: headers,
     mode: 'cors'
    };

    return fetch(JAVA_SERVER_EVENTS_BASE_URL,options)
        .then(status)
        .then(json)
        .then(data=> {
            console.log('Request succeeded with JSON response', data);
            return data;
        }).catch(error=>{
            console.log('Request failed', error);
            return Promise.reject(error);
        });
}

export function getEventById(id) 
{
    
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    let options = { method: 'GET',
    headers: headers,
     mode: 'cors'
    };

    const url = JAVA_SERVER_EVENTS_BASE_URL + "/" + id;

    return fetch(url,options)
        .then(status)
        .then(json)
        .then(data=> {
            console.log('Request succeeded with JSON response', data);
            return data;
        }).catch(error=>{
            console.log('Request failed', error);
            return Promise.reject(error);
        });
}


export function getEventsFiltered(eventType,venueType) 
{
 
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    const queryParams = [];

    if (eventType !== null && eventType !== "") {
        queryParams.push(`eventType=${eventType}`);
    }

    if (venueType !== null && venueType !== "") {
        queryParams.push(`venueType=${venueType}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const options = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
    };

    const url = `${JAVA_SERVER_EVENTS_BASE_URL}${queryString}`;


    return fetch(url,options)
        .then(status)
        .then(json)
        .then(data=> {
            console.log('Request succeeded with JSON response', data);
            return data;
        }).catch(error=>{
            console.log('Request failed', error);
            return Promise.reject(error);
        });
}
