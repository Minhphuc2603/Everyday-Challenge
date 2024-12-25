import React, { useState, useEffect } from 'react';
import { Table, Tag, Tabs } from 'antd';
import moment from 'moment';
import Header from './component/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;

const ManageChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const userID = localStorage.getItem('userId');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/challengeUser/${userID}`);
        const data = response.data.map(item => ({
          key: item.challengeID._id,
          title: item.challengeID.ChallengeName,
          description: item.challengeID.description,
          joinedAt: item.joinDate,
          status: item.status,
          isPublic: item.challengeID.isPublic,
          expiresAt: item.challengeID.ExpiresAt,
        }));
        setChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, [userID]);

  const currentChallenges = challenges.filter(challenge => challenge.isPublic );
  const expiredChallenges = challenges.filter(challenge => !challenge.isPublic);

  console.log(currentChallenges)

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <Link to={`/challenge/${record.key}`}>{text}</Link>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      sorter: (a, b) => moment(a.joinedAt).unix() - moment(b.joinedAt).unix(),
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'joined' ? 'red' : 'green'}>
          {status === 'joined' ? 'Chưa hoàn thành' : 'Hoàn thành'}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-100 h-[85vh]">
        <h2 className="text-2xl font-bold p-6 text-center">Quản lý thử thách</h2>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thử thách còn hạn" key="1">
            <Table
              columns={columns}
              dataSource={currentChallenges}
              pagination={{
                pageSize: 5,
              }}
            />
          </TabPane>
          <TabPane tab="Thử thách đã hết hạn" key="2">
            <Table
              columns={columns}
              dataSource={expiredChallenges}
              pagination={{
                pageSize: 5,
              }}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageChallenges;
