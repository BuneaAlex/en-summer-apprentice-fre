export function status(response) {
    console.log('response status '+response.status);
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

export function json(response) {
    return response.json()
}

export function authenticationHeaderSetter(headers)
{
    let username = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    let encodedCredentials = btoa(username + ':' + password);
    headers.append('Authorization', 'Basic ' + encodedCredentials);
}

export function handleLogout()
{
  var headers = new Headers();
    headers.append('Accept', 'application/json');
    authenticationHeaderSetter(headers);

    let options = { method: 'GET',
    headers: headers,
     mode: 'cors'
    };

    const url = 'http://localhost:8080/management/logout';

    return fetch(url,options)
        .then(status)
        .then(data=> {
            console.log('Request succeeded with JSON response', data);
            return data;
        }).catch(error=>{
            console.log('Request failed', error);
            return Promise.reject(error);
        });
    
}
