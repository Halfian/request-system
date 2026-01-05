import { useEffect, useState } from 'react';
import {
    collection,
    onSnapshot,
    updateDoc,
    doc, 
    query,
    where,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function EmployerDashboard() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, "requests"),
            where("archived", "==", false),
            orderBy("dateSubmitted", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRequests(data)
        });
        return () => unsubscribe()
    }, []);

    async function handleStatusChange(id, newStatus) {
        await updateDoc(doc(db, "requests", id), { status: newStatus });
    }

    async function handleArchive(id) {
        await updateDoc(doc(db, "requests", id), { archived: true });
    }

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Employer Dashboard</h2>
            {requests.length === 0 ? (
                <p className="text-gray-500">No active requests.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-center">Employee</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Type</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Description</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Date Submitted</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Archive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2 text-center">{r.employeeName || "Unknown"} ({r.employeeEmail || "No Email"})</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{r.type}</td>
                                    <td className="border border-gray-300 px-4 py-2">{r.description}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${
                                                r.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : r.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {r.dateSubmitted && r.dateSubmitted.toDate
                                            ? r.dateSubmitted.toDate().toLocaleString()
                                            : "Pending..."}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleStatusChange(r.id, "approved")}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(r.id, "rejected")}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Reject
                                        </button>                                        
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleArchive(r.id)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                        >
                                            Archive
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>                        
                </div>
            )}            
        </div>
    );
}