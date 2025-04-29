import axios from "axios";
let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
  console.log("INTERCEPTED BY BUTLER")
  console.log(error)
  if (error.response.status === 401 && !refresh) {
     refresh = true;
     console.log(localStorage.getItem('refresh_token'))
     const response = await axios.post(
        'http://127.0.0.1:8000/token/refresh/', {
                      refresh:localStorage.getItem('refresh_token')
                      }, {headers: {
                        'Content-Type': 'application/json'
                      }});
    console.log(response)
    if (response.status === 200) {
       axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;
       localStorage.setItem('access_token', response.data.access);
       localStorage.setItem('refresh_token', response.data.refresh);
       return axios(error.config);
    }
  }
  refresh = false;
  return error;
});

const accessToken = localStorage.getItem("access_token")
axios.defaults.headers.common['Authorization'] = `Bearer: ${accessToken}`

axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`
  return config
});