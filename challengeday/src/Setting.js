import React from 'react';
import { Form, Input, Button, Modal, message, Tabs } from 'antd';
import Header from './component/Header';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const Settings = () => {
    const [form] = Form.useForm();
    const id = localStorage.getItem('userId');
    const history = useNavigate();

    const handleChangePassword = () => {
        form
            .validateFields(['currentPassword', 'newPassword', 'confirmNewPassword'])
            .then(values => {
                const { currentPassword, newPassword } = values;

                fetch(`http://localhost:9999/user/password/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        oldPassword: currentPassword,
                        newPassword: newPassword,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'Password updated successfully') {
                            message.success('Đổi mật khẩu thành công!');
                            form.resetFields(['currentPassword', 'newPassword', 'confirmNewPassword']);
                        } else {
                            message.error('Mật khẩu cũ không chính xác');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        message.error('Có lỗi xảy ra! Vui lòng thử lại.');
                    });
            })
            .catch(errorInfo => {
                console.log('Validation failed:', errorInfo);
            });
    };

    const handleDeleteAccount = () => {
        Modal.confirm({
            title: 'Xác nhận xóa tài khoản',
            content: 'Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác.',
            onOk() {
                console.log('Xóa tài khoản');
            },
            onCancel() {
                console.log('Hủy xóa tài khoản');
            },
        });
    };

    const handleUpdateProfile = () => {
        form
            .validateFields(['fullName', 'bio', 'city'])
            .then(values => {
                const { fullName, bio, city } = values;
                console.log('Profile updated:', values);

                fetch(`http://localhost:9999/user-profile/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName,
                        bio,
                        address: { city },
                    }),
                })

                    .then(response => response.json())
                    .then(data => {
                        
                        message.success('Cập nhật hồ sơ thành công!');
                        form.resetFields(['fullName', 'bio', 'city']);
                        history('/profile/' + id);

                    }
                    )
                    .catch(error => {
                        console.error('Error:', error);
                        message.error('Có lỗi xảy ra! Vui lòng thử lại.');
                    });
            })
            .catch(errorInfo => {
                console.log('Validation failed:', errorInfo);
            });
    };

    return (
        <>
            <Header />
            <div className="p-6 bg-gray-100 h-[88vh]">
                <h2 className="text-2xl font-bold mb-4 text-center">Cài đặt</h2>
                <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Đổi mật khẩu" key="1">
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Mật khẩu hiện tại"
                                    name="currentPassword"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                                >
                                    <Input.Password placeholder="Mật khẩu hiện tại" />
                                </Form.Item>
                                <Form.Item
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                                >
                                    <Input.Password placeholder="Mật khẩu mới" />
                                </Form.Item>
                                <Form.Item
                                    label="Xác nhận mật khẩu mới"
                                    name="confirmNewPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Xác nhận mật khẩu mới" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleChangePassword}>
                                        Đổi mật khẩu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane tab="Cập nhật hồ sơ" key="2">
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Họ và tên"
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                >
                                    <Input placeholder="Họ và tên" />
                                </Form.Item>
                                <Form.Item
                                    label="Tiểu sử"
                                    name="bio"
                                >
                                    <Input.TextArea placeholder="Tiểu sử" />
                                </Form.Item>
                                <Form.Item
                                    label="Thành phố"
                                    name="city"
                                >
                                    <Input placeholder="Thành phố" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleUpdateProfile}>
                                        Cập nhật hồ sơ
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                    <div className="mt-4 text-center">
                        <Button type="danger" onClick={handleDeleteAccount}>
                            Xóa tài khoản
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
