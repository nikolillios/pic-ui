import {useEffect, useState} from "react";
import axios from "axios";

const Logout = () => {

    useEffect(() => {
        localStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
        window.location.href = '/login'
        // (async () => {
        //     try {
        //         const {data} = await axios.post('http://localhost:8000/logout/',{
        //             refresh_token:localStorage.getItem('refresh_token')
        //         } ,{headers: {
        //             'Content-Type': 'application/json'
        //         }}, {withCredentials: true});

        //         console.log('logout', data)
        //         localStorage.clear();
        //         axios.defaults.headers.common['Authorization'] = null;
        //         window.location.href = '/login'
        //     } catch (e) {
        //         console.log('logout not working')
        //     }
        // })();
    }, []);

    useEffect(() => {
        (async () => {
          try {
            const {data} = await  
                  axios.post('http://127.0.0.1:8000/logout/',{
                  refresh_token:localStorage.getItem('refresh_token')
                  } ,{headers: {'Content-Type': 'application/json'}},  
                  {withCredentials: true});
            localStorage.clear();
            axios.defaults.headers.common['Authorization'] = null;
            window.location.href = '/login'
            } catch (e) {
              console.log('logout not working', e)
            }
          })();
    }, []);

    return (
        <div></div>
    )
}

export default Logout