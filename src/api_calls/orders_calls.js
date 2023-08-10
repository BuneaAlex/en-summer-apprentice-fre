import { JAVA_SERVER_BASE_URL, JAVA_SERVER_ORDERS_BASE_URL} from "./consts";
import {authenticationHeaderSetter,status,json} from "./utils";

export function addOrder(order){
    console.log('inainte de fetch post'+JSON.stringify(order));

    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type","application/json");
    authenticationHeaderSetter(headers);

    let options = { method: 'POST',
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(order)};

    return fetch(JAVA_SERVER_ORDERS_BASE_URL,options)
        .then(status)
        .then(json)
        .then(response=>{
            console.log('Request succeeded with JSON response', response);
            return response;
        }).catch(error=>{
            console.log('Request failed', error);
            return Promise.reject(error);
        });
}
