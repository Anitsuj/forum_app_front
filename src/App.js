import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import LogInPage from './pages/LogInPage';
import Toolbar from './components/Toolbar';
import ProfilePage from './pages/ProfilePage';
import ForumPage from './pages/ForumPage';
import MessagesPage from './pages/MessagesPage';
import CreateDiscussionPage from './pages/CreateDiscussionPage';
import SingleDiscussionPage from './pages/SingleDiscussionPage';
import Autologin from './components/Autologin';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route index element={<AuthPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LogInPage />} />
          <Route
            path='/profile'
            element={
              <>
                <Toolbar />
                <ProfilePage />
              </>
            }
          />
          <Route
            path='/forum'
            element={
              <>
                <Toolbar />
                <ForumPage />
              </>
            }
          />
          <Route
            path='/forum/:discussionTitle'
            element={
              <>
                <Toolbar />
                <CreateDiscussionPage />
              </>
            }
          />
          <Route
            path='/forum/:discussionTitle/:discussionId'
            element={
              <>
                <Toolbar />
                <SingleDiscussionPage />
              </>
            }
          />
          <Route
            path='/messages'
            element={
              <>
                <Toolbar />
                <MessagesPage />
              </>
            }
          />
          <Route
            path='/messages/:username'
            element={
              <>
                <Toolbar />
                <ChatPage />
              </>
            }
          />
        </Routes>
        <Autologin />
      </BrowserRouter>
    </div>
  );
}

export default App;
