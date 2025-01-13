import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { TailSpin } from 'react-loader-spinner'


export default function Signin() {
    const { token, setToken } = useAuth()
    const [response, setResponse] = useState([])
    const [form, setForm] = useState({ email: '', password: '' })
    const { email, password } = form
    const [isMessageVisible, setIsMessageVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true)
        try {
            fetchUser()
            setForm({ email: '', password: '' })
            showMessage()
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchUser() {
        try {
            const response = await fetch('http://localhost:3000/admin/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            if (!response.ok) {
                throw Error('Something went wrong in connection.')
            }

            const data = await response.json()
            setResponse(data.message)
            if (!data.signedIn === false) {
                setResponse(data)
                setToken(data.token)
                localStorage.setItem('token', data.token)
            }

        } catch (error) {
            console.log("Something went wrong in the connection.", error)
        }

    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        setToken(token)
    }, [token])

    const showMessage = () => {
        setIsMessageVisible(false)
        setTimeout(() => {
            setIsMessageVisible(true)
        }, 5000)
    }

    return (
        <>
            {token ? ( <Navigate to={'/'} /> ) : isLoading ? (
                <div className="h-screen flex justify-center items-center">
                    <TailSpin   // Type of spinner
                        height="80"
                        width="80"
                        color="#1f2937"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            ) : (
                <section className="flex flex-col items-center justify-center h-screen text-gray-800">
                    <h1 className="mb-6 text-xl">Login to your account!</h1>
                    <form
                        onSubmit={handleSubmit}
                        className="justify-center gap-4 font-[inter] max-w-[380px] w-full"
                    >
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                id="email"
                                placeholder="Enter email"
                                className="border border-gray-400 rounded-md py-3 px-2 block w-full mb-4 outline-gray-700"
                            />
                        </label>
                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                id="password"
                                placeholder="Enter password"
                                className="border border-gray-400 rounded-md py-3 px-2 block w-full mb-6 outline-gray-700"
                            />
                            {isMessageVisible ? "" : <span className="text-red-500 transition-all ease-in-out duration-300 mb-6 text-sm">{response}</span>}
                        </label>
                        <button type="submit" className={`bg-gray-800 text-white py-3 rounded-md w-full`}>Login</button>
                    </form>
                </section>
            )}
        </>
    )
}


