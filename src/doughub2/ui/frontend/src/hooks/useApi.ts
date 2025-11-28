import { useEffect, useState } from 'react';

/**
 * Custom hook for data fetching with loading and error state management.
 *
 * @template T - The expected type of the response data
 * @param url - The URL to fetch data from. Pass null/undefined to skip fetching.
 * @returns An object containing { data, isLoading, error }
 *
 * @example
 * const { data, isLoading, error } = useApi<QuestionListResponse>('/api/questions');
 */
function useApi<T>(url: string | null | undefined) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Skip fetching if URL is null/undefined
        if (!url) {
            setIsLoading(false);
            setError('No URL specified');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(url);

                if (response.status === 404) {
                    throw new Error('Resource not found');
                }

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const responseData: T = await response.json();
                setData(responseData);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, error };
}

export default useApi;
