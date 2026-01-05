import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function LoginForm({ onLogin }) {
    const [form, setForm] = useState({ email: "", password: "", name: "" });
    const [error, setError] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (isSignup) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    form.email,
                    form.password
                );
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    role: "user",
                    employeeEmail: user.email,
                    employeeName: form.name,
                    createdAt: serverTimestamp(),
                });
                onLogin({ role: "user", employeeId: user.uid, employeeEmail: user.email, employeeName: form.name });
            } else {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    form.email,
                    form.password
                );
                const user = userCredential.user;

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    onLogin({ role: data.role, employeeId: user.uid, employeeEmail: data.employeeEmail, employeeName: data.employeeName });
                } else {
                    setError("No role/user found for this account.")
                }
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-500">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded p-6 w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">
                    {isSignup ? "Create Account" : "Login"}
                </h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input 
                    type="email" 
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <input 
                    type="text" 
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border w-full p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-full rounded cursor-pointer"
                >
                    {isSignup ? "Sign Up" : "Login"}
                </button>

                <p className="text-center text-sm">
                    {isSignup ? (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignup(false)}
                                className="text-blue-500 underline cursor-pointer"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignup(true)}
                                className="text-blue-500 underline cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </p>
            </form>            
        </div>
    )
}