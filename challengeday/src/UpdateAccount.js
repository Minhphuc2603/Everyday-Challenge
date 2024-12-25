import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography, Modal, Image } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './component/Header';

const { Title, Paragraph } = Typography;

const AccountUpdatePage = () => {
    const [user, setUser] = useState(null);
    const [qrUrl, setQrUrl] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const response = await axios.get(`http://localhost:9999/user-profile/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                message.error('Failed to fetch user data.');
            }
        };

        fetchUserData();
    }, []);
    const fetchUserData = async () => {
        try {

            const response = await axios.get(`http://localhost:9999/user-profile/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            message.error('Failed to fetch user data.');
        }
    };

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:9000');
        ws.onmessage = (event) => {
            fetchUserData();
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        return () => {
            ws.close();
        };
    }, []);
    const handleUpdateAccount = async () => {
        try {
            const response = await axios.post('http://localhost:9999/create-vietqr', {
                amount: 5000
            });

            setQrUrl(response.data.qrUrl);
            setTransactionId(response.data.transactionId);
            console.log(response.data.transactionId);
            setPaymentStatus('Đang chờ thanh toán...');
            setModalVisible(true);
        } catch (error) {
            console.error('Error generating QR code:', error);
            message.error('Failed to generate QR code.');
        }
    };
    useEffect(() => {
        if (!transactionId) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:9999/check-transaction-status/${transactionId}`);
                const status = response.data.status;
                console.log(status);

                if (status === 'success') {
                    setPaymentStatus('Thanh toán thành công!');
                    const ws = new WebSocket('ws://localhost:9000');
                    ws.onopen = () => {
                        ws.send('Update account type');
                        ws.close();
                    };


                    const updateData = {
                        accountType: 1
                    };


                    const updateResponse = await axios.put(`http://localhost:9999/user/updateAccountType/${userId}`, updateData);
                    console.log('Update account type response:', updateResponse.data);

                    clearInterval(interval);
                } else if (status === 'failed') {
                    setPaymentStatus('Thanh toán thất bại. Vui lòng thử lại.');
                    clearInterval(interval);
                } else {
                    setPaymentStatus('Đang chờ thanh toán...');
                }
            } catch (error) {
                console.error('Error checking transaction status:', error);
                setPaymentStatus('Có lỗi xảy ra. Vui lòng thử lại.');
                clearInterval(interval);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [transactionId]);

    const handleModalOk = () => {
        setModalVisible(false);

    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Header />

            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center p-4">Cập nhật thông tin tài khoản</h1>
                <Card title={`Xin chào, ${user.fullName}`} style={{ marginTop: 16 }}>
                    <div className="mt-4">
                        <Paragraph>Email: {user?.userId?.email}</Paragraph>
                    </div>
                    {user?.userId?.accountType === 1 ? (
                        <div className="mt-4">
                            <Paragraph style={{ color: 'blue', fontWeight: 'bold' }}>Tài khoản bạn đã được nâng cấp rồi</Paragraph>
                        </div>
                    ) : (
                        <Button type="primary" onClick={handleUpdateAccount} className="mt-4">
                            UpdateAccount
                        </Button>
                    )}

                    <Modal
                        title="QR Code"
                        visible={modalVisible}
                        onOk={handleModalOk}
                        onCancel={handleModalCancel}
                    >
                        <div className="text-center">
                            {paymentStatus === 'Đang chờ thanh toán...' ? (
                                <>
                                    <Image src={qrUrl} alt="QR Code" style={{ maxWidth: '100%' }} />
                                    <p>{paymentStatus}</p>
                                </>
                            ): (
                                <p className="text-green-500">{paymentStatus}</p>
                            )}

                        </div>
                    </Modal>
                </Card>
            </div>
        </>
    );
};

export default AccountUpdatePage;
