import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
function Registration() {

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [rollNo, setRollNo] = useState('');
   const [department, setDepartment] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState('');
   const navigate = useNavigate();

   const handleRegister = async (e) => {
    e.preventDefault();

    try {
       const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password,rollNo,department }),
       });

       const data = await response.json();
       if (response.ok) {
          setMessage('Registration successful! Please check your email to verify your account.');
          setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
       } else {
          setMessage(data.message || 'Registration failed.');
       }
    } catch (error) {
       setMessage('An error occurred. Please try again.');
    }
 };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Register
        </h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={name} onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll No:
            </label>
            <input
              type="text"
              name="rollNo"
              value={rollNo} onChange={(e) => setRollNo(e.target.value)}
             
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department:
            </label>
            <input
              type="text"
              name="department"
              value={department} onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email ID:
            </label>
            <input
              type="email"
              name="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
