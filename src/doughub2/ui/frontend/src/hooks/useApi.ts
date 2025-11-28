import { useCallback, useEffect, useState } from 'react';

interface UseApiResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Custom hook for fetching data from the API.
 * 
 * @param url - The API endpoint URL to fetch from. Pass null to skip fetching.
 * @returns An object containing the data, loading state, error, and refetch function.
 */
export function useApi<T>(url: string | null): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!url) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result: T = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}
