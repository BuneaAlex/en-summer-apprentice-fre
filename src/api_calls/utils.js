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
