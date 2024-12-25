import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import moment from 'moment/moment';
import Header from './component/Header';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:9999/user')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleBan = (userId) => {
        fetch(`http://localhost:9999/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: false }),
        })
            .then(response => response.json())
            .then(data => {
                setUsers(users.map(user => user._id === userId ? { ...user, active: false } : user));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleUnban = (userId) => {
        fetch(`http://localhost:9999/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: true }),
        })
            .then(response => response.json())
            .then(data => {
                setUsers(users.map(user => user._id === userId ? { ...user, active: true } : user));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'Username',
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'name',
        },
        {
            title: 'Joined At',
            dataIndex: 'createdAt',
            key: 'joinedAt',
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (               
                    <>
                        {record.isVerified ? (
                            record.active ? (
                                <Button type="primary" danger onClick={() => handleBan(record._id)}>
                                    Ban
                                </Button>
                            ) : (
                                <Button type="primary" onClick={() => handleUnban(record._id)}>
                                    Unban
                                </Button>
                            )
                        ) : null}
                    </>
            ),
        },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Header />
            <div className="p-6 bg-gray-100 h-[85vh]">
                <h2 className="text-2xl font-bold p-6 text-center">Quản lí người dùng</h2>
                <Table
                    columns={columns}
                    dataSource={users}
                    pagination={{
                        pageSize: 5,
                    }}
                />
            </div>
        </>
    );
};

export default ManageUser;
