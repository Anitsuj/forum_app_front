import React, { useEffect, useRef, useState } from 'react';
import http from '../plugins/http';
import { useStore } from '../store/myStore';
import { useNavigate } from 'react-router-dom';

function ForumPage() {
  const { user } = useStore((state) => state);
  const { topic, setTopic } = useStore((state) => state);
  const [error, setError] = useState('');
  const topicRef = useRef();
  const navigate = useNavigate();

  async function fetchTopics() {
    try {
      const response = await http.get('getTopics');
      if (response.success) {
        setTopic(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching topics.');
    }
  }

  useEffect(() => {
    fetchTopics();
  }, []);

  async function createTopic() {
    const inputValue = topicRef.current.value.trim();

    if (!inputValue) {
      setError('Topic title is required.');
      return;
    }

    const data = {
      username: user.username,
      title: topicRef.current.value.toLowerCase(),
    };

    try {
      const response = await http.postWithToken('createTopic', data);
      if (response.success) {
        setError('Topic has been created.');
        topicRef.current.value = '';
        fetchTopics();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error on creating topic.');
    }
  }

  return (
    <div className='forum-page-wrapper'>
      <div className='forum-page'>
        {topic.map((mainTopic, i) => (
          <div
            className='forum-page-topic'
            key={i}
            onClick={() => navigate(`/forum/${mainTopic.title}`)}
          >
            <h3>
              {mainTopic.title.charAt(0).toUpperCase() +
                mainTopic.title.slice(1)}
            </h3>
            <p>Discussions amount: {mainTopic.discussionsCount}</p>
          </div>
        ))}
        {user.role === 'admin' && (
          <div className='create-topic'>
            <p>You can create new topic below.</p>
            <input type='text' placeholder='Topic title' ref={topicRef} />
            {error && <div className='error'>{error}</div>}
            <button className='primary-btn' onClick={createTopic}>
              Create topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForumPage;
