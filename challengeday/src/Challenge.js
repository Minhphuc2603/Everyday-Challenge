import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from './component/Header';
import { Table, Tag, Upload, Button, Input, message, Modal, Typography, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import io from 'socket.io-client';

import { getDatabase, ref as dbRef, push, onValue } from "./firebase";
const { Title, Paragraph } = Typography;

const { TextArea } = Input;

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [usersInChallenge, setUsersInChallenge] = useState([]);
  const [solutionDescription, setSolutionDescription] = useState('');
  const [fileList, setFileList] = useState([]);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserContent, setSelectedUserContent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const userID = localStorage.getItem('userId');
  const [profileData, setProfileData] = useState(null);
  const socketRef = useRef();
  const vip = localStorage.getItem('vip');
  console.log(vip)

  useEffect(() => {
    socketRef.current = io('http://localhost:9090');

    const joinRoom = () => {
      socketRef.current.emit('joinRoom', { challengeId: id, userId: userID });
    };

    const handleMessage = (message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
    };

    socketRef.current.on('receiveMessage', handleMessage);
    joinRoom();
    loadMessagesFromFirebase(id);


    return () => {
      socketRef.current.off('receiveMessage', handleMessage);
      socketRef.current.disconnect();
    };
  }, [id, userID]);



  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const messageData = {
        challengeId: id,
        userId: userID,
        fullName: profileData?.fullName,
        content: chatMessage,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.emit('sendMessage', { challengeId: id, userId: userID, content: chatMessage });
      const database = getDatabase();
      const messageRef = dbRef(database, `challenges/${id}/messages`);
      push(messageRef, messageData)
        .then(() => {
          console.log('Message saved to Firebase');
        })
        .catch((error) => {
          console.error('Error saving message to Firebase:', error);
        });

      setChatMessage('');
    }
  };

  const loadMessagesFromFirebase = (id) => {
    const database = getDatabase();
    const chatRef = dbRef(database, `challenges/${id}/messages`);
    onValue(chatRef, (snapshot) => {
      const messages = snapshot.val() ? Object.values(snapshot.val()) : [];
      setMessages(messages);
    });
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/challenge/${id}`);
        setChallenge(response.data);
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };

    const fetchUsersInChallenge = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/challengeUser/user/${id}`);
        setUsersInChallenge(response.data);
      } catch (error) {
        console.error('Error fetching users in challenge:', error);
      }
    };

    fetchChallenge();
    fetchUsersInChallenge();
  }, [id]);
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
    const checkUserJoined = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/challengeUser/${userID}/${id}`);
        setStatus(response.data);
      } catch (error) {
        console.error('Error checking user challenge status:', error);
      }
    };

    checkUserJoined();
  }, [userID, id]);

  const handleDescriptionChange = (e) => {
    setSolutionDescription(e.target.value);
  };

  const handleFileUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Keep only the last uploaded file
    setFileList(fileList);
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const storageRef = ref(storage, `nopbai/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      throw error;
    }
  };

  const fetchUsersInChallenge = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/challengeUser/user/${id}`);
      setUsersInChallenge(response.data);
    } catch (error) {
      console.error('Error fetching users in challenge:', error);
    }
  };

  const checkUserJoined = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/challengeUser/${userID}/${id}`);
      setStatus(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error checking user challenge status:', error);
    }
  };

  const handleUploadSolution = async () => {
    if (!solutionDescription || fileList.length === 0) {
      message.error('Vui lòng nhập mô tả và tải lên ít nhất một tài liệu/ảnh');
      return;
    }

    try {
      setIsSubmitting(true); // Disable submit button during submission
      const uploadPromises = fileList.map(file => uploadImageToFirebase(file.originFileObj));
      const uploadResults = await Promise.all(uploadPromises);

      const solutionData = {
        content: solutionDescription,
        contentImg: uploadResults,
      };

      const response = await axios.put(`http://localhost:9999/challengeUser/${userID}/${id}`, solutionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Solution submitted:', response.data);
      setIsSubmitting(false);
      const ws = new WebSocket('ws://localhost:9000');
      ws.onopen = () => {
        ws.send('Nộp bài thành công');
        ws.close();
      };


      message.success('Nộp bài thành công');
      checkUserJoined();
      fetchUsersInChallenge();
    } catch (error) {
      console.error('Error submitting solution:', error);
      setIsSubmitting(false);
      message.error('Đã xảy ra lỗi khi nộp bài, vui lòng thử lại sau');
    }
  };
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9000');
    ws.onmessage = (event) => {
      fetchUsersInChallenge();
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      ws.close();
    };
  }, []);

  if (!challenge) {
    return <div className="text-center mt-20">Không tìm thấy thử thách</div>;
  }

  const tagColors = [
    'blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo'
  ];

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * tagColors.length);
    return tagColors[index];
  };
  const handleUserClick = async (user) => {
    try {
      const response = await axios.get(`http://localhost:9999/challengeUser/${user}/${id}`);
      setSelectedUserContent(response.data);
      console.log(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching user content:', error);
    }
  };

  console.log(message);


  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'userID',
      key: 'userID',
      render: (user, record) => (
        record.status === 'completed' ? (
          <span onClick={() => handleUserClick(user._id)} style={{ cursor: 'pointer', color: 'blue' }}>
            {user.fullName}
          </span>
        ) : (
          <span style={{ color: 'gray' }}>
            {user.fullName}
          </span>
        )
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'joined' ? 'red' : 'green'}>
          {status === 'joined' ? 'Chưa hoàn thành' : 'Hoàn thành'}
        </Tag>
      ),
    },
  ];
  if (status.length === 0) {
    return (
      <>
        <Header />
        <div className='text-center justify-center items-center' style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
          <Card title="Thông báo">
            <Typography>
              <Title level={3}>Bạn chưa tham gia thử thách này </Title>
              <Paragraph>
                Xin lỗi, thử thách này bạn chưa  tham gia. Vui lòng quay trở lại trang chủ để tìm thử thách khác.
              </Paragraph>
            </Typography>
          </Card>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
          <p className="text-gray-700 mb-6">{challenge.description}</p>
          <div className="grid gap-4" style={{
            gridTemplateColumns: challenge.contentImg.length === 1 ? '1fr' :
              challenge.contentImg.length === 2 ? '1fr 1fr' :
                challenge.contentImg.length === 3 ? '1fr 1fr 1fr' :
                  '1fr 1fr'
          }}>
            {challenge.contentImg.map((image, idx) => (
              <img key={idx} src={image} alt={`Hình ảnh thử thách ${idx + 1}`} className="w-full h-auto rounded-lg" />
            ))}
          </div>
          <div className="flex flex-wrap space-x-2 mt-4">
            <Tag color={getRandomColor()} className="mb-2">{challenge.categoryID.name}</Tag>
          </div>
          {status[0]?.status === "joined" && status[0]?.challengeID?.isPublic ? (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Làm thử thách này</h2>
              <TextArea
                className="w-full p-4 border rounded-lg"
                rows={10}
                value={solutionDescription}
                onChange={handleDescriptionChange}
                placeholder="Mô tả giải pháp của bạn..."
              />
              <Upload
                className="mt-4"
                fileList={fileList}
                onChange={handleFileUpload}
                beforeUpload={() => false}
                accept=".jpg,.jpeg,.png"
              >
                <Button icon={<UploadOutlined />}>Tải lên ảnh hoặc tài liệu</Button>
              </Upload>
              {isSubmitting ? (
                <Button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
                  disabled
                >
                  Nộp bài
                </Button>
              ) : (
                <Button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  onClick={handleUploadSolution}
                >
                  Nộp bài
                </Button>
              )}
            </div>
          ) : !status[0]?.challengeID?.isPublic ? (
            <>
              <p className="text-xl text-red-400 font-bold mb-4"> Đã Hết hạn</p>
              <div className='p-6'>
                <p className="text-xl font-bold mb-4">Giải pháp</p>
                <h2 className="text-gray-700 mb-4">{status[0]?.content}</h2>
                <img className="text-gray-700 mb-6" src={status[0]?.contentImg}></img>
              </div>
            </>
          ) : <div className='p-6'>
            <p className="text-xl font-bold mb-4">Giải pháp</p>
            <h2 className="text-gray-700 mb-4">{status[0]?.content}</h2>
            <img className="text-gray-700 mb-6" src={status[0]?.contentImg}></img>
          </div>}

        </div>
        <div className="w-1/3 ml-4">
          <h2 className="text-2xl font-bold mb-4">Người dùng tham gia</h2>
          <Table columns={columns} dataSource={usersInChallenge} rowKey="_id" />
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-2">Phòng chat</h2>
            <div className="chat-container border rounded p-4 mb-4" style={{ height: '400px', overflowY: 'scroll' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.userId === userID ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${msg.userId === userID ? 'bg-gray-100 text-gray-800 text-right' : 'bg-gray-100 text-gray-800 text-left'}`}>
                    <span className="font-bold block">{msg.fullName}</span>{msg.content}
                    
                  </div>
                </div>
              ))}
            </div>
            <div className="flex">
              <TextArea
                rows={2}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Nhập tin nhắn của bạn..."
              />
              <Button
                type="primary"
                className="ml-2"
                onClick={handleSendMessage}
              >
                Gửi
              </Button>
            </div>
          </div>
        </div>

      </div>


      <Modal
        title="Thông tin bài làm"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedUserContent && (
          <>
            <p>{selectedUserContent[0]?.content}</p>
            <div className="grid gap-4 mt-4">
              <img src={selectedUserContent[0]?.contentImg} className="w-full h-auto rounded-lg" />
            </div>
          </>
        )}
      </Modal>
    </>
  );



}

export default ChallengeDetail;
