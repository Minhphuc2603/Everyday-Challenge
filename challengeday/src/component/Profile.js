import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userID = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`http://localhost:9999/user-profile/${userID}`)
      .then(response => response.json())
      .then(data => {
        setProfileData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userID]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profileData) return <div>No profile data available.</div>;

  const backgroundImageUrl = profileData.backgroundPictureUrl ? profileData.backgroundPictureUrl : 'https://www.w3schools.com/w3images/lights.jpg';
  const img = profileData.profilePictureUrl ? profileData.profilePictureUrl : 'https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png';
  return (
    <div className='bg-gray-300 flex h-[600px] shadow-lg rounded-xl'>
      <div className="bg-cover bg-center h-80 w-full flex flex-col items-center justify-center relative rounded-xl" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
        <img className="w-24 h-24 rounded-full border-4 border-white absolute -bottom-12" src={img} alt="Profile" />
        <div className="flex flex-col items-center absolute -bottom-44 p-2">
          <Link to={`/profile/${userID}`} className="text-xl mb-2 hover:underline">{profileData?.fullName}</Link>
          <div className="rounded-t-2xl ">
            <h3 className="text-lg mb-2 text-center">About</h3>
            <p className="text-gray-700 text-center">{profileData?.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
