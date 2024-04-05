import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/myStore';
import http from '../plugins/http';

function ProfilePage() {
  const { user, setUser } = useStore((state) => state);
  const { setMessage } = useStore((state) => state);
  const { setUnreadMessages } = useStore((state) => state);
  const [allDiscussions, setAllDiscussion] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [error, setError] = useState('');
  const imageRef = useRef();

  async function updateImage() {
    const data = {
      image: imageRef.current.value,
      username: user.username,
      role: user.role,
    };

    try {
      const response = await http.postWithToken('updateImage', data);
      if (response.success) {
        setUser(response.data);
        setError('Image has been updated.');
        imageRef.current.value = '';
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error on updating image.');
    }
  }

  async function fetchDiscussions() {
    try {
      const response = await http.get(`getAllDiscussions`);
      if (response.success) {
        setAllDiscussion(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching discussions.');
    }
  }

  useEffect(() => {
    fetchDiscussions();
  }, []);

  async function fetchAllAnswers() {
    try {
      const response = await http.get(`getAllAnswers`);
      if (response.success) {
        setAllAnswers(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching discussions.');
    }
  }

  useEffect(() => {
    fetchAllAnswers();
  }, []);

  const userDiscussions = allDiscussions.filter(
    (discussion) => discussion.username === user.username
  );

  const userAnswers = allAnswers.filter(
    (answer) => answer.username === user.username
  );

  function getTopicNameById(discussionId) {
    const discussion = allDiscussions.find(
      (discussion) => discussion._id === discussionId
    );
    return discussion ? discussion.title : '';
  }

  const fetchMessages = async (loggedInUsername) => {
    try {
      const response = await http.get('getAllMessages');
      if (response.success) {
        setMessage(response.data);
        updateUnreadMessages(response.data, loggedInUsername);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log('Error fetching messages.');
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchMessages(user.username);
    }
  }, [user]);

  const updateUnreadMessages = (messages, loggedInUsername) => {
    if (messages && messages.length > 0) {
      const unreadCount = messages.filter(
        (msg) => msg.usernameWhoGets === loggedInUsername && msg.unreadMessage
      ).length;
      setUnreadMessages(unreadCount);
    }
  };

  return (
    <div className='profile-page-wrapper'>
      <div className='profile-page'>
        <div className='profile-image-container'>
          <img src={user.image} alt='User image' className='user-image' />
          <p className='change-image-info'>
            You can change your profile image below.
          </p>
          <input type='text' placeholder='New image url' ref={imageRef} />
          {error && <div className='error'>{error}</div>}
          <button className='primary-btn' onClick={updateImage}>
            Update image
          </button>
        </div>
        <div className='profile-page-info'>
          <h2>{user.username}</h2>
          <h4>Topics created in forum:</h4>
          {userDiscussions.map((discussion, index) => (
            <div key={index}>
              <p className='topics-created-in-forum'>{discussion.title}</p>
            </div>
          ))}
          <h4>Posts written in forum:</h4>
          {userAnswers.map((answer, index) => (
            <div key={index} className='posts-written-in-forum'>
              <p>Topic: {getTopicNameById(answer.discussionTheme)}</p>
              <p className='answers'>Post: {answer.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
