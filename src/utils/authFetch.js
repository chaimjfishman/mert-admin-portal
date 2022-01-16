export default async function authFetch(url, body) {
    const token = window.sessionStorage.getItem('token')

    if (token != null) {
        if (body.headers == null) {
            body.headers = {};
        };
    
        body.headers['Authorization'] = `Bearer ${token}`
    };
    console.log("authfetch")
    console.log(body)

    return fetch(url, body)
}