import { JAVA_SERVER_EVENTS_BASE_URL} from "./consts";
import {authenticationHeaderSetter,status,json} from "./utils";

export async function getAllEvents() 
{
    
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    let options = { method: 'GET',
    headers: headers,
     mode: 'cors'
    };

    return await fetch(JAVA_SERVER_EVENTS_BASE_URL,options)
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

export async function getEventById(id) 
{
    
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    let options = { method: 'GET',
    headers: headers,
     mode: 'cors'
    };

    const url = JAVA_SERVER_EVENTS_BASE_URL + "/" + id;

    return await fetch(url,options)
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

