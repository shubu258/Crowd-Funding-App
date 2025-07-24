import React, { useEffect, useState } from "react";
import './App.css';

const API_URL = "http://localhost:4000/api/jars/count";

function App() {
  const [jars, setJars] = useState([]);
  const [jarCount, setJarCount] = useState(0);
  const [form, setForm] = useState({ name: "", cause: "", targetAmount: "" });
  const [donate, setDonate] = useState({ jarId: "", amount: "" });
  const [message, setMessage] = useState("");

  // Fetch jar count and details
  useEffect(() => {
    fetch(API_URL)/count
      .then((res) => res.json())
      .then((data) => {
        setJarCount(data.count);
        const jarPromises = [];
        for (let i = 0; i < data.count; i++) {
          jarPromises.push(fetch(`${API_URL}/${i}`).then((r) => r.json()));
        }
        Promise.all(jarPromises).then(setJars);
      });
  }, [message]);

  // Handle form input
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create a new jar
  const handleCreateJar = async (e) => {
    e.preventDefault();
    setMessage("Creating jar...");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        cause: form.cause,
        targetAmount: form.targetAmount,
      }),
    });
    const data = await res.json();
    setMessage(data.success ? "Jar created!" : data.error);
    setForm({ name: "", cause: "", targetAmount: "" });
  };

  // Handle donation input
  const handleDonateChange = (e) => {
    setDonate({ ...donate, [e.target.name]: e.target.value });
  };

  // Donate to a jar
  const handleDonate = async (e) => {
    e.preventDefault();
    setMessage("Processing donation...");
    const res = await fetch(`${API_URL}/${donate.jarId}/donate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: donate.amount }),
    });
    const data = await res.json();
    setMessage(data.success ? "Donation successful!" : data.error);
    setDonate({ jarId: "", amount: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Donation Jar DApp</h1>
      <form
        className="bg-white shadow-md rounded p-4 mb-6 w-full max-w-md"
        onSubmit={handleCreateJar}
      >
        <h2 className="text-xl font-semibold mb-2">Create a Jar</h2>
        <input
          className="border p-2 w-full mb-2"
          name="name"
          placeholder="Jar Name"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          name="cause"
          placeholder="Cause"
          value={form.cause}
          onChange={handleFormChange}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          name="targetAmount"
          placeholder="Target Amount (wei)"
          type="number"
          value={form.targetAmount}
          onChange={handleFormChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Jar
        </button>
      </form>

      <form
        className="bg-white shadow-md rounded p-4 mb-6 w-full max-w-md"
        onSubmit={handleDonate}
      >
        <h2 className="text-xl font-semibold mb-2">Donate to a Jar</h2>
        <input
          className="border p-2 w-full mb-2"
          name="jarId"
          placeholder="Jar ID"
          type="number"
          value={donate.jarId}
          onChange={handleDonateChange}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          name="amount"
          placeholder="Amount (wei)"
          type="number"
          value={donate.amount}
          onChange={handleDonateChange}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Donate
        </button>
      </form>

      {message && (
        <div className="mb-4 text-center text-blue-700 font-semibold">
          {message}
        </div>
      )}

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">All Jars</h2>
        <div className="grid grid-cols-1 gap-4">
          {jars.map((jar, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded p-4 flex flex-col"
            >
              <div className="font-bold text-lg">{jar.name}</div>
              <div className="text-gray-700">Cause: {jar.cause}</div>
              <div className="text-gray-700">
                Target: {jar.targetAmount} wei
              </div>
              <div className="text-gray-700">
                Current: {jar.currentAmount} wei
              </div>
              <div className="text-gray-700">
                Withdrawn: {jar.isWithdrawn ? "Yes" : "No"}
              </div>
              <div className="text-gray-500 text-xs mt-2">
                Creator: {jar.creator}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;