import { JAVA_SERVER_BASE_URL, JAVA_SERVER_EVENTS_BASE_URL} from "./consts";
import {status,json} from "./utils";


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

