import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './component/Header';
import { Modal, Button, Input, Upload, message, Spin } from 'antd';
import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import moment from 'moment';

function UserProfile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [showPostInput, setShowPostInput] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:9999/user-profile/${userId}`)
      .then(response => response.json())
      .then(data => {
        setProfileData(data);
      })
      .catch(err => {
        console.log(err);
      });
    fetchPostsByUserId();
  }, [userId]);

  const fetchPostsByUserId = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/posts/${userId}`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleEditClick = () => {
    setEditModalVisible(true);
  };

  const handleEditImg = () => {
    setEditImg(true);
  };

  const handlePost = () => {
    setShowPostInput(true);
  };

  const handleEditOk = async () => {
    setLoading(true);
    try {
      let coverPhotoUrl = profileData?.backgroundPictureUrl;

      if (coverFile) {
        const storageRef = ref(storage, `coverPhotos/${coverFile.name}`);
        await uploadBytes(storageRef, coverFile);
        coverPhotoUrl = await getDownloadURL(storageRef);
      }

      const response = await axios.patch(`http://localhost:9999/user-profile/background/${userId}`, {
        backgroundPictureUrl: coverPhotoUrl,
      });

      setProfileData(response.data);
      message.success('Cover photo updated successfully!');
    } catch (error) {
      message.error('Failed to update cover photo.');
      console.error(error);
    } finally {
      setLoading(false);
      setEditModalVisible(false);
      setCoverFile(null);
    }
  };

  const handleEditImgOk = async () => {
    setLoading(true);
    try {
      let coverImgUrl = profileData?.profilePictureUrl;

      if (imgFile) {
        const storageRef = ref(storage, `coverImg/${imgFile.name}`);
        await uploadBytes(storageRef, imgFile);
        coverImgUrl = await getDownloadURL(storageRef);
      }

      const response = await axios.patch(`http://localhost:9999/user-profile/img/${userId}`, {
        profilePictureUrl: coverImgUrl,
      });

      setProfileData(response.data);
      message.success('Thay ảnh đại diện thành công!!');
    } catch (error) {
      message.error('Có lỗi khi thay đổi ảnh @@.');
      console.error('Error during profile update:', error);
    } finally {
      setLoading(false);
      setEditImg(false);
      setImgFile(null);
    }
  };

  const handlePostOk = async () => {
    setLoading(true);
    try {
      let picturePaths = [];

      if (fileList.length > 0) {
        const uploadPromises = fileList.map(file => {
          const storageRef = ref(storage, `postPictures/${file.name}`);
          return uploadBytes(storageRef, file.originFileObj).then(snapshot => getDownloadURL(snapshot.ref));
        });

        picturePaths = await Promise.all(uploadPromises);
      }

      const response = await axios.post('http://localhost:9999/posts', {
        userId,
        description: postContent,
        picturePath: picturePaths,
      });

      setPostContent("");
      setFileList([]);
      setShowPostInput(false);
      message.success('Post created successfully!');
      fetchPostsByUserId(); // Refresh posts after creating a new one
    } catch (error) {
      message.error('Failed to create post.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
        <div className="relative w-full max-w-4xl h-96 bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-6" style={{ backgroundImage: `url(${profileData?.backgroundPictureUrl || 'https://www.w3schools.com/w3images/lights.jpg'})` }}>
          <div className="w-full h-full bg-black bg-opacity-40 flex flex-col justify-end items-center p-6">
            <div className="relative">
              <img className="w-32 h-32 rounded-full border-4 border-white" src={profileData?.profilePictureUrl || 'https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png'} alt="Profile" />
              {userId === localStorage.getItem("userId") && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100" onClick={handleEditImg}>
                  <CameraOutlined className="text-white text-2xl" />
                </div>
              )}
            </div>
            <div className="text-center text-white">
              <h2 className="text-3xl mt-2 font-bold">{profileData?.fullName}</h2>
              <p className="mt-2">{profileData?.bio}</p>
            </div>
          </div>

          {/* Edit Button */}
          {userId === localStorage.getItem("userId") && (
            <button className="absolute top-4 right-4 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75" onClick={handleEditClick}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.232a2.5 2.5 0 113.536 3.536L7 18.035 3 21l2.965-4.035L17.232 5z"></path>
              </svg>
            </button>
          )}
        </div>
        {userId === localStorage.getItem("userId") && (
          <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 mb-6">
            <div className="flex items-center">
              <img src={profileData?.profilePictureUrl || 'https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png'} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
              <input
                type="text"
                className="border border-gray-500 text-gray-700 px-4 py-2 rounded-lg w-full"
                placeholder='Ban dang nghi gi vay ?'
                onClick={handlePost}
                disabled={userId !== localStorage.getItem("userId")}
              />
            </div>
          </div>
        )}
        {/* Ảnh đại diện */}
        <Modal
          title="Chỉnh sửa anh đại diện"
          open={editImg}
          onOk={handleEditImgOk}
          confirmLoading={loading}
          onCancel={() => setEditImg(false)}
        >
          <Upload
            listType="picture"
            beforeUpload={(file) => {
              setImgFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh </Button>
          </Upload>
        </Modal>
        {/* Ảnh Bìa */}
        <Modal
          title="Chỉnh sửa ảnh bìa"
          open={editModalVisible}
          onOk={handleEditOk}
          confirmLoading={loading}
          onCancel={() => setEditModalVisible(false)}
        >
          <Upload
            listType="picture"
            beforeUpload={(file) => {
              setCoverFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh </Button>
          </Upload>
        </Modal>
        {/* Đăng bài */}
        <Modal
          title="Đăng bài"
          open={showPostInput}
          onOk={handlePostOk}
          confirmLoading={loading}
          onCancel={() => setShowPostInput(false)}
        >
          <div>
            <Input.TextArea
              rows={4}
              placeholder="Viết nội dung bài viết của bạn ở đây..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <Upload
              className="mt-4"
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </div>
        </Modal>

        {/* Posts Section */}
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 mb-6">
          <h3 className="text-2xl font-semibold border-b pb-2">Bài viết</h3>
          <div className="mt-4 space-y-4">
            {posts.map((post, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <img src={profileData?.profilePictureUrl || "https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png"} alt="Profile" className="w-14 h-14 rounded-full mr-4" />
                  <div>
                    <p>{post.userId.fullName}</p>
                    <p className='text-gray-700 text-xs'>{moment(post.createdAt).fromNow()}</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{post.description}</p>
                <div className="grid gap-2 mt-2" style={{
                  gridTemplateColumns: post.picturePath.length === 1 ? '1fr' :
                    post.picturePath.length === 2 ? '1fr 1fr' :
                      post.picturePath.length === 3 ? '1fr 1fr 1fr' :
                        '1fr 1fr'
                }}>
                  {post.picturePath.map((image, idx) => (
                    <img key={idx} src={image} alt={`Post image ${idx + 1}`} className="w-full h-auto rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
