import { useState } from 'react';
import axios from 'axios';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://usermanagemet-server.vercel.app/login', { email, password });
      console.log('====================================');
      console.log(response);
      console.log('====================================');
      const { token, user } = response.data;
  
      // Store the token in localStorage
      localStorage.setItem('token', token);
  
      // Redirect the user to another page after successful login
      alert(`Welcome back, ${user.name}!`);
      window.location.href = '/admin'; // Replace with the appropriate route in your app
  
    } catch (err) {
      // If the error message is related to being blocked
      if (err.response?.data?.error === 'Invalid credentials') {
        setError("You're blocked. Please contact support.");
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    }
  };
  
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('https://usermanagemet-server.vercel.app/login', { email, password });
  //     const { token, user } = response.data;

  //     // Store the token in localStorage
  //     localStorage.setItem('token', token);

  //     // Optionally, redirect the user to another page after successful login
  //     alert(`Welcome back, ${user.name}!`);
  //     window.location.href = '/admin'; // Replace with the appropriate route in your app
  //   } catch (err) {
  //     setError(err.response?.data?.error || 'Login failed. Please try again.');
  //   }
  // };

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
              
            </div>
            <div>
            <button
  type="button" // change type to "button" to prevent it from submitting the form
  onClick={() => window.location.href = '/reg'} // redirect to the /reg path
  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-green-600"
>
  Not Registered yet? Sign Up
</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
