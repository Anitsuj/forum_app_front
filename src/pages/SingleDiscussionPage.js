import React, { useEffect, useRef, useState } from 'react';
import http from '../plugins/http';
import { useStore } from '../store/myStore';
import { useParams } from 'react-router-dom';
import SendMessageModal from '../components/SendMessageModal';

function SingleDiscussionPage() {
  const { user } = useStore((state) => state);
  const { post, setPost } = useStore((state) => state);
  const { discussion, setDiscussion } = useStore((state) => state);
  const { allUsers, setAllUsers } = useStore((state) => state);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState('');
  const [error, setError] = useState('');
  const commentRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const { discussionTitle } = useParams();
  const { discussionId } = useParams();

  async function fetchComments() {
    try {
      const response = await http.get(`getSingleDiscussion/${discussionId}`);
      if (response.success) {
        setPost(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching topics.');
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

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

  async function createComment() {
    const inputCommentValue = commentRef.current.value.trim();

    if (!inputCommentValue) {
      setError('Your comment is required.');
      return;
    }

    const data = {
      username: user.username,
      comment: commentRef.current.value,
      image: imageRef.current.value,
      video: videoRef.current.value,
      discussionId: discussionId,
    };

    try {
      const response = await http.postWithToken('createPost', data);
      if (response.success) {
        setError('Your comment has been saved.');
        commentRef.current.value = '';
        imageRef.current.value = '';
        videoRef.current.value = '';
        fetchComments();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error on leaving comment.');
    }
  }

  function getYoutubeVideoId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return 'error';
    }
  }

  async function fetchAllUsers() {
    try {
      const response = await http.get(`getAllUsers`);
      if (response.success) {
        setAllUsers(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching discussions.');
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className='single-discussion-page-wrapper'>
      <div className='single-discussion-page'>
        {discussion.map((singleDiscussion, i) => {
          if (singleDiscussion._id === discussionId) {
            const matchedUser = allUsers.find(
              (user) => user.username === singleDiscussion.username
            );
            const usersToDisplay = matchedUser ? [matchedUser] : [];
            return (
              <div className='discussion-info' key={i}>
                {usersToDisplay.map((userToDisplay, index) => (
                  <div className='discussion-owner-info' key={index}>
                    <img src={userToDisplay.image} alt='User image' />{' '}
                    <div className='username-btn-container'>
                      <h3 className='discussion-owner-username'>
                        {userToDisplay.username}
                      </h3>
                      {user.username !== userToDisplay.username && (
                        <button
                          className='send-message-btn'
                          onClick={() => {
                            setShowMessageModal(true);
                            setMessageRecipient(userToDisplay.username);
                          }}
                        >
                          Send message
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <h3 className='discussion-title'>{singleDiscussion.title}</h3>
                <p>{singleDiscussion.description}</p>
              </div>
            );
          }
          return null;
        })}
        {post.map((singlePost, i) => (
          <div className='post' key={i}>
            <h3>{singlePost.username}</h3>
            <p>{singlePost.comment}</p>
            {singlePost.image || singlePost.video ? (
              <div className='image-video-container'>
                {singlePost.image && (
                  <img src={singlePost.image} alt='Post image' />
                )}
                {singlePost.video && (
                  <div className='video-container'>
                    <iframe
                      width='560'
                      height='315'
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                        singlePost.video
                      )}`}
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title='Embedded video'
                    ></iframe>
                  </div>
                )}
              </div>
            ) : null}
            {user.username !== singlePost.username && (
              <button
                className='send-message-btn'
                onClick={() => {
                  setShowMessageModal(true);
                  setMessageRecipient(singlePost.username);
                }}
              >
                Send message
              </button>
            )}
          </div>
        ))}
        <div className='create-post'>
          <p>You can post below.</p>
          <input type='text' placeholder='Your comment' ref={commentRef} />
          <input type='text' placeholder='Image url' ref={imageRef} />
          <input type='text' placeholder='Video url' ref={videoRef} />
          {error && <div className='error'>{error}</div>}
          <button className='primary-btn' onClick={createComment}>
            Send
          </button>
        </div>
        {showMessageModal && (
          <SendMessageModal
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            recipient={messageRecipient}
          />
        )}
      </div>
    </div>
  );
}

export default SingleDiscussionPage;
