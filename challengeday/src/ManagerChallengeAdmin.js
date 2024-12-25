import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tabs } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import Header from './component/Header';

const { TabPane } = Tabs;

const AdminApprovalManager = () => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingChallenge, setViewingChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC733'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('http://localhost:9999/challenge');
        const challenges = response.data;


        setChallenges(challenges);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        message.error('Có lỗi xảy ra khi tải thử thách');
      }
    };

    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:9999/challenge');
      const challenges = response.data;


      setChallenges(challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      message.error('Có lỗi xảy ra khi tải thử thách');
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9000');
    ws.onmessage = (event) => {
      fetchChallenges();
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      ws.close();
    };
  }, []);

  const showViewModal = (challenge) => {
    setViewingChallenge(challenge);
    setIsViewModalVisible(true);
  };

  const handleApprove = async (challenge) => {
    try {
      await axios.put(`http://localhost:9999/challenge/${challenge._id}`, { isVerified: true });
      const updatedChallenges = challenges.map(c =>
        c._id === challenge._id ? { ...challenge, isVerified: true } : c
      );
      const ws = new WebSocket('ws://localhost:9000');
      ws.onopen = () => {
        ws.send('Challenge verified');
        ws.close();
      };
      setChallenges(updatedChallenges);
      message.success('Thử thách đã được phê duyệt');
    } catch (error) {
      console.error('Error approving challenge:', error);
      message.error('Có lỗi xảy ra khi phê duyệt thử thách');
    }
  };

  const handleReject = async (challenge) => {
    try {
      await axios.put(`http://localhost:9999/challenge/${challenge._id}`, { isVerified: false });
      const updatedChallenges = challenges.filter(c => c._id !== challenge._id);
      const ws = new WebSocket('ws://localhost:9000');
      ws.onopen = () => {
        ws.send('Challenge rejected');
        ws.close();
      };
      setChallenges(updatedChallenges);
      message.success('Thử thách đã bị từ chối');
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      message.error('Có lỗi xảy ra khi từ chối thử thách');
    }
  };

  const renderCategory = (record) => {
    return record.categoryID.name;
  };

  const renderName = (record) => {
    return record.OwnerID.fullName;
  };

  const pendingColumns = [
    { title: 'Người tạo', key: 'OwnerID', render: renderName },
    { title: 'Tiêu đề', dataIndex: 'ChallengeName', key: 'title' },
    { title: 'Thể loại', key: 'categoryID', render: renderCategory },
    {
      title: 'Hành động', key: 'actions', render: (text, record) => (
        <span>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)}>Xem</Button>
          <Button icon={<CheckOutlined />} onClick={() => handleApprove(record)} style={{ marginLeft: 8 }}>Phê duyệt</Button>
        </span>
      )
    }
  ];

  const approvedColumns = [
    { title: 'Người tạo', key: 'OwnerID', render: renderName },
    { title: 'Tiêu đề', dataIndex: 'ChallengeName', key: 'title' },
    { title: 'Thể loại', key: 'categoryID', render: renderCategory },
    {
      title: 'Hành động', key: 'actions', render: (text, record) => (
        <span>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)}>Xem</Button>
          <Button icon={<CloseOutlined />} onClick={() => handleReject(record)} style={{ marginLeft: 8 }} danger>Từ chối</Button>
        </span>
      )
    }
  ];

  const expiredColumns = [
    { title: 'Người tạo', key: 'OwnerID', render: renderName },
    { title: 'Tiêu đề', dataIndex: 'ChallengeName', key: 'title' },
    { title: 'Thể loại', key: 'categoryID', render: renderCategory },
    {
      title: 'Hành động', key: 'actions', render: (text, record) => (
        <span>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)}>Xem</Button>
        </span>
      )
    }
  ];

  const pendingChallenges = challenges.filter(challenge => !challenge.isVerified && challenge.isPublic);
  const approvedChallenges = challenges.filter(challenge => challenge.isVerified && challenge.isPublic);

  const expiredChallenges = challenges.filter(challenge => !challenge.isPublic);

  return (
    <div>
      <Header />
      <h2 className="text-2xl font-bold mb-4 text-center p-4">Quản lý phê duyệt thử thách</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thử thách chưa phê duyệt" key="1">
          <Table columns={pendingColumns} dataSource={pendingChallenges} rowKey="_id" />
        </TabPane>
        <TabPane tab="Thử thách đã phê duyệt" key="2">
          <Table columns={approvedColumns} dataSource={approvedChallenges} rowKey="_id" />
        </TabPane>
        <TabPane tab="Thử thách đã hết hạn" key="3">
          <Table columns={expiredColumns} dataSource={expiredChallenges} rowKey="_id" />
        </TabPane>
      </Tabs>

      <Modal
        title="Xem thử thách"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>Đóng</Button>
        ]}
      >
        {viewingChallenge && (
          <div>
            <h3 className='text-xl font-bold text-center'>{viewingChallenge.ChallengeName}</h3>
            <p>{viewingChallenge.description}</p>
            <div>
              {viewingChallenge.contentImg.map((img, index) => (
                <img key={index} src={img} alt="content" style={{ maxWidth: '100%', marginBottom: 10 }} />
              ))}
            </div>
            <div>
              <span className="tag" style={{
                backgroundColor: getRandomColor(),
                borderRadius: '12px',
                padding: '5px 10px',
                color: 'white'
              }}>
                {viewingChallenge.categoryID.name}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminApprovalManager;
