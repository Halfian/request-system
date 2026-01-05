import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function EmployeeForm({ userProfile }) {
    const [form, setForm] = useState({ type: "", description: "" });
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) {
                setMessage("You must be logged in.");
                return;
            }

            await addDoc(collection(db, "requests"), {
                employeeId: user.uid,
                employeeEmail: userProfile.employeeEmail,
                employeeName: userProfile.employeeName,
                type: form.type,
                description: form.description,
                status: "pending",
                dateSubmitted: serverTimestamp(),
                archived: false,
            })

            setMessage("Request submitted successfully!");
            setForm({ type: "", description: " "});
        } catch (err) {
            setMessage("Error: " + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && <p className="text-sm">{message}</p>}
            <input 
                type="text"
                placeholder="Request Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border p-2 w-full"
                required
            />
            <textarea 
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border p-2 w-full"
                required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit Request
            </button>
        </form>
    )
}