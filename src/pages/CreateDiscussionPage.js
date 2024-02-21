import React, { useEffect, useRef, useState } from 'react';
import http from '../plugins/http';
import { useStore } from '../store/myStore';
import { useNavigate, useParams } from 'react-router-dom';

function CreateDiscussionPage() {
  const { user } = useStore((state) => state);
  const { discussion, setDiscussion } = useStore((state) => state);
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const { discussionTitle } = useParams();
  const navigate = useNavigate();

  async function fetchDiscussions() {
    try {
      const response = await http.get(`getDiscussions/${discussionTitle}`);
      if (response.success) {
        setDiscussion(response.data);
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

  async function createDiscussion() {
    const inputTitleValue = titleRef.current?.value.trim();
    const inputDescriptionValue = descriptionRef.current?.value.trim();

    if (!inputTitleValue || !inputDescriptionValue) {
      setError('Discussion title and description are required.');
      return;
    }

    const data = {
      username: user.username,
      title: inputTitleValue,
      description: inputDescriptionValue,
      discussionTitle: discussionTitle,
    };

    try {
      const response = await http.postWithToken('createDiscussion', data);
      if (response.success) {
        setError('Discussion has been created.');
        titleRef.current.value = '';
        descriptionRef.current.value = '';
        fetchDiscussions();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error on creating discussion.');
    }
  }

  return (
    <div className='create-discussion-page-wrapper'>
      <div className='create-discussion-page'>
        {discussion.map((singleDiscussion, i) => (
          <div
            className='discussion'
            key={i}
            onClick={() =>
              navigate(`/forum/${discussionTitle}/${singleDiscussion._id}`)
            }
          >
            <h3>{singleDiscussion.title}</h3>
            <p>Answers: {singleDiscussion.answers.length}</p>
          </div>
        ))}
        <div className='create-discussion'>
          <p>You can create discussion below.</p>
          <input type='text' placeholder='Discussion title' ref={titleRef} />
          <input
            type='text'
            placeholder='Discussion description'
            ref={descriptionRef}
          />
          {error && <div className='error'>{error}</div>}
          <button className='primary-btn' onClick={createDiscussion}>
            Create discussion
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDiscussionPage;
