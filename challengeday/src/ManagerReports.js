import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import Header from './component/Header';

const ManageReports = () => {
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:9999/reports');
            console.log('Fetched Reports:', response.data);


            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:9000');
        ws.onmessage = () => {
            fetchReports();
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        return () => {
            ws.close();
        };
    }, []);

    const handleResolveReport = async (reportId) => {
        try {
            await axios.delete(`http://localhost:9999/reports/${reportId}`);
            message.success('Xoa thanh cong!');
            fetchReports(); // Refresh the reports list
        } catch (error) {
            console.error('Error resolving report:', error);
            message.error('Failed to resolve report.');
        }
    };

    const handleBanChallenge = async (challengeId) => {
        try {
            await axios.put(`http://localhost:9999/challenge/ban/${challengeId}`);
            message.success('Challenge has been banned successfully!');
            const ws = new WebSocket('ws://localhost:9000');
            ws.onopen = () => {
                ws.send("Ban challenge successfully");
                ws.close();
            };
            fetchReports(); // Refresh the reports list
        } catch (error) {
            console.error('Error banning challenge:', error);
            message.error('Failed to ban challenge.');
        }
    };

    const renderChallengeName = (record) => {
        return record.challengeID?.ChallengeName;
    };

    const renderReportedBy = (record) => {
        return record.reportedBy?.fullName;
    };

    const columns = [
        {
            title: 'Challenge Name',
            key: 'challengeID',
            render: renderChallengeName,
        },
        {
            title: 'Reported By',
            key: 'reportedBy',
            render: renderReportedBy,
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Ý kiến',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => handleResolveReport(record._id)} type="primary">
                        Xoá
                    </Button>
                    {record.challengeID?.status !== false && (
                        <Button onClick={() => handleBanChallenge(record.challengeID._id)} type="danger" className="ml-2">
                            Chặn
                        </Button>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            <Header />
            <div className="p-10">
                <h1 className="text-3xl text-red-500 text-center font-bold mb-10">Manage Reports</h1>
                <Table dataSource={reports} columns={columns} rowKey="_id" />
            </div>
        </>
    );
};

export default ManageReports;
