import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Topics from './pages/Topics';
import QuestionSolver from './pages/QuestionSolver';
import Analytics from './pages/Analytics';
import NotImplemented from './pages/NotImplemented';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/solver" element={<QuestionSolver />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/troubleshooting" element={<NotImplemented />} />
        <Route path="/reports" element={<NotImplemented />} />
        <Route path="/settings" element={<NotImplemented />} />
        <Route path="/not-implemented" element={<NotImplemented />} />
        <Route path="*" element={<NotImplemented />} />
      </Route>
    </Routes>
  );
}
