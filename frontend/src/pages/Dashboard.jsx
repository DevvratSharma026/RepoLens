import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/auth.api';
import DashboardLayout from '../layouts/DashboardLayout';
import NewReviewButton from '../Components/NewReviewButton';

const Dashboard = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');

    //clear cookie 
    document.cookie = "token=; Max-Age=0; path=/;";
    navigate('/login');
  }

  //fetch the user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        handleLogout();
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <header className="px-8 py-6 border-b border-bg-border bg-bg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Dashboard
            </h1>
            <p className="text-text-secondary mt-1">
              Welcome back, {user.firstName}! Here's your code review overview.
            </p>
          </div>

          <NewReviewButton props={"+ New Review"} onClick={() => navigate("/review/new")} />

        </div>
      </header>


      <section className='p-8 text-text-muted'>
        Stats & recent reviews will go here.
      </section>
    </DashboardLayout>
  );
}

export default Dashboard