import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, Select, message, DatePicker } from 'antd';
import { PlusOutlined , UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from 'moment';

const { Option } = Select;

const CreateChallengeForm = ({ visible, onCreate, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [contentImages, setContentImages] = useState([]);
  
  const [tag, setTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null); // New state for expiration date
  const [loading, setLoading] = useState(false);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9999/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async () => {
    setLoading(true);

    try {
      let imageUrl = '';

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const newChallenge = {
        ChallengeName: title,
        description: description,
        contentImg: imageUrl,
        isPublic: true,
        isVerified: false,
        ExpiresAt: expiresAt ? expiresAt.toISOString() : "2024-12-31T23:59:59Z", // Include expiration date
        quantity: 10,
        categoryID: tag,
        OwnerID: id
      };
      

      console.log(newChallenge);
      const response = await axios.post('http://localhost:9999/challenge', newChallenge);
      message.success('Tạo thử thách thành công!');
      const ws = new WebSocket('ws://localhost:9000');
      ws.onopen = () => {
        ws.send('Challenge created');
        ws.close();
      };
      onCreate(response.data);
      setTitle('');
      setDescription('');
      setImage(null);
      setContentImages([]);
      setTag('');
      setExpiresAt(null);
    } catch (error) {
      message.error('Tạo thử thách thất bại!');
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
      setImage(null);
    }
  };
  const disablePastDates = (current) => {
       
    return current && current < moment().startOf('day');
  };

  const handleImageChange = ({ fileList }) => setImage(fileList[0]?.originFileObj);

  const handleTagChange = (value) => {
    setTag(value);
  };

  const handleContentImagesChange = ({ fileList }) => setContentImages(fileList.map(file => file.originFileObj));

  const handleDateChange = (date) => {
    setExpiresAt(date);
  };

  return (
    <Modal
      visible={visible}
      title="Tạo thử thách mới"
      okText="Tạo"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleCreate}
      confirmLoading={loading}
    >
      <Form layout="vertical">
        <Form.Item label="Tiêu đề">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label="Mô tả">
          <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item label="Hình ảnh nội dung">
        <Upload
            listType="picture"
            beforeUpload={(file) => {
              setImage(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh </Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Loại thử thách">
          <Select value={tag} onChange={handleTagChange}>
            {categories.map(category => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Ngày hết hạn">
      <DatePicker
        value={expiresAt}
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        disabledDate={disablePastDates} // Thêm thuộc tính disabledDate
      />
    </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChallengeForm;