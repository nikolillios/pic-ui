import { jwtDecode }  from 'jwt-decode'
import { useState } from "react";
import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/token/'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submit = async e => {
        e.preventDefault()
        const loginCredentials = {
            username: username,
            password: password
        };
        const {data} = await axios.post(
            API_URL,
            loginCredentials, 
            {headers: {
                'Content-Type': 'application/json'
            }}, {withCredentials: true});
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const tokenObj = jwtDecode(data.access)
        localStorage.setItem('uid', tokenObj['user_id'])
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
        window.location.href = '/'
    }
    return (
        <div>
            <h1>Hello world</h1>
            <form onSubmit={submit}>
                <label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={e => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login