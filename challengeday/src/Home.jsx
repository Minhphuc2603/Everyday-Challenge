
import React, { useEffect, useState } from 'react';
import Header from './component/Header';
import Profile from './component/Profile';
import CreateChallengeForm from './component/Form';
import { message, Modal, Input } from "antd";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const [profileData, setProfileData] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);;
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userId");
  const [modalShare, setModalShare] = useState(false);
  const [email, setEmail] = useState('');
  const [challengeID, setChallengeID] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:9999/user-profile/${userID}`)
      .then(response => response.json())
      .then(data => {
        setProfileData(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  useEffect(() => {

    const ws = new WebSocket('ws://localhost:9000');

    ws.onmessage = (event) => {

      challengeshine();
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const [challenges, setChallenges] = useState([]);
  const history = useNavigate();

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ];

  const getRandomColor = () => {
    return tagColors[Math.floor(Math.random() * tagColors.length)];
  };

  const calculateRemainingTime = (expiresAt) => {
    const now = moment();
    const expiration = moment(expiresAt);
    const duration = moment.duration(expiration.diff(now));

    const hours = duration.asHours();
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.floor(hours % 24);
      return `Còn lại ${days} ngày ${remainingHours} giờ `;
    }
    return hours > 1 ? ` Còn lại ${Math.floor(hours)} giờ ` : "Ít hơn 1 giờ";
  };


  const handleShareClick = (challengeID) => {
    setChallengeID(challengeID);

    setModalShare(true);
  };

  const shareChallenge = () => {
    setLoading(true);
    try {
      axios.post('http://localhost:9999/challenge/share', {
        email: email,
        fullName: profileData?.fullName,
        id: challengeID,
      })
        .then(response => {
          console.log(response.data.message);
          message.success('Chia sẻ thành công!');
          setModalShare(false);
        })
        .finally(() => {
          setModalShare(false);
          setEmail('');
          setChallengeID("");
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleJoinClick = (challenge) => {
    history(`/viewchallenge/${challenge}`);
  };

  const handleCreate = (newChallenge) => {
    setChallenges([...challenges, newChallenge]);
    challengeshine();
    profile();
    setIsCreateModalVisible(false);
  };

  useEffect(() => {
    axios.get('http://localhost:9999/challenge')
      .then(response => {
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setChallenges(sortedPosts);
      })
      .catch(error => {
        console.error('There was an error fetching the challenges!', error);
      });
  }, []);
  const challengeshine = async () => {
    axios.get('http://localhost:9999/challenge')
      .then(response => {
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setChallenges(sortedPosts);
      })
      .catch(error => {
        console.error('There was an error fetching the challenges!', error);
      });
  };
  const profile = async () => {
    fetch(`http://localhost:9999/user-profile/${userID}`)
      .then(response => response.json())
      .then(data => {
        setProfileData(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {contextHolder}
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="w-full flex">
          {token ? (
            <div className="w-1/4 pr-4">
              <Profile />
            </div>
          ) : <div className="w-1/4 pr-4">
            {/* <Profile /> */}
          </div>}

          <div className="w-1/2">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center">Thử thách</h2>
              {token ? (
                <button
                  className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  Tạo thử thách
                </button>
              ) : null}
              {challenges.length === 0 ? (
                <p className="text-gray-600 text-center">No challenges created yet.</p>
              ) : (
                <ul className="space-y-6">
                  {challenges.map((challenge, index) => (
                    challenge.isVerified && challenge.isPublic ? (
                      <li key={index} className="bg-white p-6 rounded shadow-md">
                        <div className="flex justify-start">
                          <img className="w-14 h-14 rounded-full" src={challenge?.OwnerID?.profilePictureUrl || 'https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png'} alt="Profile" />
                          <div className="ml-4">
                            <p className='font-bold'>{challenge?.OwnerID?.fullName}</p>
                            <p className='text-gray-700 text-xs'>{moment(challenge.createdAt).fromNow()}</p>
                          </div>
                        </div>
                        <div className="mt-2 p-2">
                          <p className="font-bold p-4 text-center text-xl">{challenge.ChallengeName}</p>

                          <div className="mt-2 grid gap-2" style={{
                            gridTemplateColumns: challenge.contentImg.length === 1 ? '1fr' :
                              challenge.contentImg.length === 2 ? '1fr 1fr' :
                                challenge.contentImg.length === 3 ? '1fr 1fr 1fr' :
                                  '1fr 1fr'
                          }}>

                            {challenge.contentImg.map((image, idx) => (
                              image ? (
                                <img
                                  key={idx}
                                  src={image}
                                  alt={`Challenge content image ${idx + 1}`}
                                  className="w-full h-auto rounded-lg"
                                />
                              ) : null
                            ))}
                          </div>
                          <div className="flex flex-wrap space-x-2 mt-2 justify-start">
                            <span key={index} className={`text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded ${getRandomColor()}`}>
                              {challenge.categoryID.name}
                            </span>
                          </div>
                          <p className='text-red-500 text-sm'>{calculateRemainingTime(challenge.ExpiresAt)}</p>
                          {challenge.isPublic ? (


                            <div className="flex justify-end">
                              <button
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                                onClick={() => handleJoinClick(challenge._id)}
                              >
                                View
                              </button>
                              <div className='ml-2 mt-6'>
                                <img
                                  src="/share.svg"
                                  alt="Share icon"
                                  className="w-6 h-6 text-gray-600 cursor-pointer"
                                  onClick={() => handleShareClick(challenge._id)}
                                />
                              </div>
                            </div>
                          ) : (null)}
                        </div>

                      </li>
                    ) : null

                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="w-1/4 pl-4 justify-end">
            <Profile />
          </div>
        </div>
      </div>
      {/* Modal to enter email */}
      <Modal
        title="Chia sẻ thử thách"
        open={modalShare}
        onOk={shareChallenge}
        onCancel={() => setModalShare(false)}
        confirmLoading={loading}
      >
        <p>Hãy nhập email :</p>

        <Input value={email} onChange={(e) => setEmail(e.target.value)} />

      </Modal>

      <CreateChallengeForm
        visible={isCreateModalVisible}
        onCreate={handleCreate}
        onCancel={() => setIsCreateModalVisible(false)}
      />
    </>
  );
}

export default Home;
