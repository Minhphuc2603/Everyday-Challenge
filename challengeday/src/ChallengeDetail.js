import React, { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Button, message, Typography, Modal, Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import Header from './component/Header';

const { Title, Paragraph } = Typography;

const ChallengeDetailne = () => {
    const [challenge, setChallenge] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [joinedChallengeCount, setJoinedChallengeCount] = useState(0);
    const [user , setUser] = useState(null);
    const { id } = useParams();
    const userID = localStorage.getItem("userId");
    const [userChallenge , setUserChallenge] = useState("");
    const history = useNavigate();
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/challenge/${id}`);
                setChallenge(response.data);
                console.log(response.data);
                setUserChallenge(response.data.OwnerID._id);
            } catch (error) {
                console.error('Error fetching challenge:', error);
                message.error('Failed to fetch challenge details.');
            }
        };

        fetchChallenge();
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
    }, [userID]);

    
    

    useEffect(() => {
        fetch(`http://localhost:9999/user-profile/${userChallenge}`)
            .then(response => response.json())
            .then(data => {
                setUser(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [userChallenge]);

    useEffect(() => {
        const checkUserJoined = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/challengeUser/${userID}/${id}`);
                if (response.data.length > 0) {
                    setIsJoined(true);
                }
            } catch (error) {
                console.error('Error checking user challenge status:', error);
            }
        };

        checkUserJoined();
    }, [userID, id]);
    useEffect(() => {
        const checkChallenge = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/challengeUser/${userID}`);
                if (response.data.length > 0) {
                    setJoinedChallengeCount(response.data.length);
                }
            } catch (error) {
                console.error('Error checking user challenge status:', error);
            }
        };

        checkChallenge();
    }, [userID]);

    console.log(joinedChallengeCount)

    const handleJoinChallenge = async () => {
        try {
            // Check account type
            if (profileData?.userId?.accountType === 1) {
                const response = await axios.post('http://localhost:9999/challengeUser', {
                    userID: userID,
                    challengeID: id,
                });
                const ws = new WebSocket('ws://localhost:9000');
                ws.onopen = () => {
                    ws.send('Tham gia thử thách này');
                    ws.close();
                };
                message.success('Tham gia thử thách thành công!');
                setIsJoined(true);
                setJoinedChallengeCount(prevCount => prevCount + 1);
                history('/challenge/' + id);
            } else {

                if (joinedChallengeCount >= 5) {
                    message.warning('Bạn đã đạt số lượng thử thách tối đa. Vui lòng cập nhật tài khoản để tham gia thêm.');
                    return;
                }

                const response = await axios.post('http://localhost:9999/challengeUser', {
                    userID: userID,
                    challengeID: id,
                });
                message.success('Tham gia thử thách thành công!');
                setIsJoined(true);
                setJoinedChallengeCount(prevCount => prevCount + 1);
                history('/challenge/' + id);
            }
        } catch (error) {
            console.error('Error joining challenge:', error);
            message.error('Hãy đăng nhập để tham gia thử thách');
        }
    };

    const handleReportChallenge = () => {
        setIsReportModalVisible(true);
    };

    const handleReportSubmit = async () => {
        try {
            await axios.post(`http://localhost:9999/reports/${id}`, {
                reportedBy: userID,
                reason,
                comment,
            });
            message.success('Report submitted successfully!');

            const ws = new WebSocket('ws://localhost:9000');
            ws.onopen = () => {
                ws.send('Challenge reported');
                ws.close();
            };


            setIsReportModalVisible(false);
            setReason('');
            setComment('');
        } catch (error) {
            console.error('Error reporting challenge:', error);
            message.error('Error submitting report.');
        }
    };

    const closeReportModal = () => {
        setIsReportModalVisible(false);
        setReason('');
        setComment('');
    };

    if (!challenge) {
        return <p>Loading...</p>;
    }
    if (!challenge.isPublic) {
        return (
            <>
                <Header />
                <div className='text-center justify-center items-center' style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
                    <Card title="Thông báo">
                        <Typography>
                            <Title level={3}>Thử thách đã hết hạn và không công khai</Title>
                            <Paragraph>
                                Xin lỗi, thử thách này đã hết hạn và không còn công khai để tham gia. Vui lòng quay trở lại trang chủ để tìm thử thách khác.
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
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center p-4">Chi tiết thử thách</h1>
                <Card
                    title={challenge.ChallengeName}
                    extra={
                        <>
                            {isJoined ? (
                                <Button type="primary" onClick={() => history('/challenge/' + id)}>Xem thử thách</Button>
                            ) : (
                                <Button type="primary" onClick={handleJoinChallenge}>Tham gia thử thách</Button>
                            )}
                            {userID ? (
                                <Button className='ml-6' type="default" onClick={handleReportChallenge}>
                                    <ExclamationCircleOutlined /> Report
                                </Button>
                            ) : (null)}

                        </>
                    }
                    style={{ marginTop: 16 }}
                >
                    <div className="flex items-center">
                        <Avatar size={64} src={user?.profilePictureUrl || 'https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png'} />
                        <div className="ml-4">
                            <span className='text-lg font-bold'>{challenge?.OwnerID.fullName}</span>
                            <p className="text-gray-700 text-xs">{moment(challenge.createdAt).fromNow()}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-700 mt-4 text-base">{challenge.description}</p>
                        <div className="mt-2">
                            {challenge.contentImg.map((image, idx) => (
                                <img key={idx} src={image} alt={`Challenge content image ${idx + 1}`} className="w-full h-auto rounded-lg" />
                            ))}
                        </div>
                        <div className="flex flex-wrap mt-4">
                            <Tag className="text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
                                {challenge.categoryID.name}
                            </Tag>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal
                title="Report Challenge"
                open={isReportModalVisible}
                onCancel={closeReportModal}
                footer={null}
            >
                <Form onFinish={handleReportSubmit}>
                    <Form.Item label="Lý do" required>
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </Form.Item>
                    <Form.Item label="Ý kiến khác">
                        <Input.TextArea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Report
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default ChallengeDetailne;
