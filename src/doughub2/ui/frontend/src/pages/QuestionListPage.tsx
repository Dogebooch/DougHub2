import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/apiConfig';
import useApi from '../hooks/useApi';

/** Question information from the API */
interface QuestionInfo {
    question_id: number;
    source_name: string;
    source_question_key: string;
}

/** API response for listing questions */
interface QuestionListResponse {
    questions: QuestionInfo[];
}

/**
 * Question List Page Component
 *
 * Fetches and displays a list of all extracted questions from the backend.
 * Each question is rendered as a clickable list item that links to the
 * question detail page.
 */
function QuestionListPage() {
    const { data, isLoading, error } = useApi<QuestionListResponse>(API_ENDPOINTS.questionsList);
    const questions = data?.questions ?? [];

    return (
        <div className="min-h-screen bg-[#2C3134] text-[#F0DED3]">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-[#F0DED3] mb-2">
                            Extracted Questions
                        </h1>
                        <p className="text-[#A79385]">
                            Browse all questions extracted from supported sites
                        </p>
                    </header>

                    {/* Content Section */}
                    <section className="bg-[#2F3A48] rounded-lg border border-[#506256] p-6">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="text-center py-8">
                                <p className="text-[#F0DED3] text-lg">Loading questions...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-[#09232A] rounded-lg p-4 border border-[#DE634D]/30">
                                <p className="text-[#DE634D]">{error}</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && questions.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-[#858A7E]">
                                    No questions found. Extract some questions to get started.
                                </p>
                            </div>
                        )}

                        {/* Questions List */}
                        {!isLoading && !error && questions.length > 0 && (
                            <ul className="space-y-3">
                                {questions.map((question) => (
                                    <li key={question.question_id}>
                                        <Link
                                            to={`/question/${question.question_id}`}
                                            className="block bg-[#09232A] rounded-lg p-4 border border-[#506256]/30 hover:bg-[#315C62] hover:border-[#C8A92A]/50 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-[#DEC28C] font-medium">
                                                        {question.source_name}
                                                    </span>
                                                    <span className="text-[#858A7E] mx-2">•</span>
                                                    <span className="text-[#F0DED3]">
                                                        {question.source_question_key}
                                                    </span>
                                                </div>
                                                <span className="text-[#858A7E] text-sm">
                                                    ID: {question.question_id}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Summary */}
                    {!isLoading && !error && (
                        <footer className="mt-4 text-right">
                            <p className="text-[#858A7E] text-sm">
                                {questions.length} question{questions.length !== 1 ? 's' : ''} found
                            </p>
                        </footer>
                    )}
                </div>
            </main>
        </div>
    );
}

export default QuestionListPage;
