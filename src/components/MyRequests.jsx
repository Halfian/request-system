import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function MyRequests({ userProfile }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (!userProfile) return;

        const q = query(
            collection(db, "requests"),
            where("employeeId", "==", userProfile.employeeId),
            orderBy("dateSubmitted", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRequests(data)
        });

        return () => unsubscribe();
    }, [userProfile]);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">My Requests</h2>
            {requests.length === 0 ? (
                <p className="text-gray-500">No requests submitted yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Date Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{r.type}</td>
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
                                        {r.dateSubmitted?.toDate().toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}