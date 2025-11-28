/**
 * Main Application Component
 *
 * Sets up routing for the Question Reviewer application.
 * Routes:
 * - / : Question list page (all extracted questions)
 * - /question/:questionId : Individual question view
 */

import { Route, Routes } from 'react-router-dom';
import QuestionListPage from './pages/QuestionListPage';
import QuestionViewPage from './pages/QuestionViewPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<QuestionListPage />} />
            <Route path="/question/:questionId" element={<QuestionViewPage />} />
        </Routes>
    );
}

export default App;
