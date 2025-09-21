import { jwtDecode }  from 'jwt-decode'
import { useState } from "react";
import apiClient from "../services/apiClient";
import { getApiEndpoint } from "../config/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submit = async e => {
        e.preventDefault()
        const loginCredentials = {
            username: username,
            password: password
        };
        const {data} = await apiClient.post(
            getApiEndpoint('AUTH', 'LOGIN'),
            loginCredentials);
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const tokenObj = jwtDecode(data.access)
        localStorage.setItem('uid', tokenObj['user_id'])
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
        window.location.href = '/'
    }
    return (
        <>
            <h2 className='m-5 text-4xl'>Sign in</h2>
            <div className='flex items-center justify-center'>
                <form className="p-8 border-4 border-purple-400 rounded bg-black" onSubmit={submit}>
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            required
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="m-1">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-20 h-10 p-0 m-2" type="submit">Sign In</button>
                </form>
            </div>
        </>
    )
}

export default Login