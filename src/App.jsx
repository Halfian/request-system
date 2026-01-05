import { useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployerDashboard from './components/EmployerDashboard';
import MyRequests from './components/MyRequests' ;
import LoginForm from './components/LoginForm';

export default function App() {
  const [userProfile, setUserProfile] = useState(null);

  function handleLogin(profile) {
    setUserProfile(profile)
  }

  return (
    <div className="p-6">
      {!userProfile ? (
        <LoginForm onLogin={handleLogin} />
      ) : userProfile.role === "admin" ? (
        <EmployerDashboard userProfile={userProfile} />
      ) : (
        <>
          <EmployeeForm userProfile={userProfile} />
          <MyRequests userProfile={userProfile} />
        </>
      )}
    </div>
  )
}