import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

/** Question detail from the API */
interface QuestionDetail {
    question_id: number;
    source_name: string;
    source_question_key: string;
    raw_html: string;
}

/**
 * Question View Page Component
 *
 * Fetches and displays the full details of a single question, including
 * its raw HTML content. The question ID is extracted from the URL using useParams.
 */
function QuestionViewPage() {
    const { questionId } = useParams<{ questionId: string }>();
    const [question, setQuestion] = useState<QuestionDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch question data when questionId changes
    useEffect(() => {
        if (!questionId) {
            setError('No question ID specified');
            setIsLoading(false);
            return;
        }

        const fetchQuestion = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/questions/${questionId}`);

                if (response.status === 404) {
                    throw new Error('Question not found');
                }

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data: QuestionDetail = await response.json();
                setQuestion(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                setQuestion(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId]);

    return (
        <div className="min-h-screen bg-[#2C3134] text-[#F0DED3]">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Link */}
                    <nav className="mb-6">
                        <Link
                            to="/"
                            className="text-[#C8A92A] hover:text-[#DEC28C] transition-colors"
                        >
                            ← Back to Questions
                        </Link>
                    </nav>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="bg-[#2F3A48] rounded-lg border border-[#506256] p-6">
                            <p className="text-[#F0DED3] text-lg text-center py-8">Loading question...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="bg-[#2F3A48] rounded-lg border border-[#506256] p-6">
                            <div className="bg-[#09232A] rounded-lg p-4 border border-[#DE634D]/30">
                                <p className="text-[#DE634D]">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Question Content */}
                    {question && !isLoading && !error && (
                        <>
                            {/* Header */}
                            <header className="mb-6">
                                <h1 className="text-2xl font-bold text-[#F0DED3] mb-2">
                                    {question.source_name}
                                </h1>
                                <p className="text-[#A79385]">
                                    <span className="text-[#858A7E]">Question Key:</span>{' '}
                                    <code className="text-[#DEC28C] bg-[#09232A] px-2 py-0.5 rounded">
                                        {question.source_question_key}
                                    </code>
                                </p>
                            </header>

                            {/* Raw HTML Content */}
                            <section className="bg-[#2F3A48] rounded-lg border border-[#506256] p-6">
                                <h2 className="text-lg font-semibold text-[#DEC28C] mb-4">
                                    Question Content
                                </h2>
                                <div
                                    className="bg-[#09232A] rounded-lg p-4 border border-[#506256]/30 prose prose-invert max-w-none
                                               [&_*]:text-[#F0DED3] [&_a]:text-[#C8A92A] [&_a:hover]:text-[#DEC28C]
                                               [&_h1]:text-[#F0DED3] [&_h2]:text-[#F0DED3] [&_h3]:text-[#F0DED3]
                                               [&_p]:text-[#F0DED3] [&_li]:text-[#F0DED3]
                                               [&_strong]:text-[#DEC28C] [&_em]:text-[#A79385]
                                               [&_code]:bg-[#254341] [&_code]:px-1 [&_code]:rounded
                                               [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.raw_html) }}
                                />
                            </section>

                            {/* Metadata Footer */}
                            <footer className="mt-4 text-right">
                                <p className="text-[#858A7E] text-sm">
                                    Question ID: {question.question_id}
                                </p>
                            </footer>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default QuestionViewPage;
