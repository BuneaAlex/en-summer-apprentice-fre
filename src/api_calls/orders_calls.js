import { JAVA_SERVER_ORDERS_BASE_URL, NET_SERVER_ORDERS_BASE_URL} from "./consts";
import {authenticationHeaderSetter,status,json} from "./utils";

export function addOrder(order){

    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type","application/json");
    authenticationHeaderSetter(headers);

    let options = { method: 'POST',
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(order)};

    return fetch(JAVA_SERVER_ORDERS_BASE_URL,options)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error.message);
        });
}


export function getAllOrders() 
{
    
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    let options = { method: 'GET',
    headers: headers,
     mode: 'cors'
    };

    return fetch(JAVA_SERVER_ORDERS_BASE_URL,options)
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

export function deleteOrder(id){

    let headers = new Headers();
    headers.append("Accept", "application/json");

    let options = { method: 'DELETE',
        headers: headers,
        mode: 'cors'
    };

    const url=NET_SERVER_ORDERS_BASE_URL+'/'+id;
    
    return fetch(url,options)
        .then(status)
        .then(json)
        .then(response=>{
            return response;
        }).catch(e=>{
            console.log('error '+e);
            return Promise.reject(e);
        });

}

export function updateOrder(id,patchRequestBody){

    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type","application/json");

    let options = { method: 'PATCH',
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(patchRequestBody)};

    const url=NET_SERVER_ORDERS_BASE_URL+'/'+id;

    return fetch(url,options)
        .then(response=>{
            return response;
        }).catch(error=>{
            console.log('Request failed', error);
            return Promise.reject(error);
        });
}

