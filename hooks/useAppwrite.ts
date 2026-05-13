import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams: P) => Promise<void>;
}

//ptž managing differn calls (get calls for properties, create calls, filter calls, search calls...), použijeme genetic TS parametry T + P:
export const useAppwrite = <T, P extends Record<string, string | number>>({
    fn,
    params = {} as P,
    skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    //fetch data
    const fetchData = useCallback(
        async (fetchParams: P) => {
            setLoading(true);
            setError(null);

            try {
                const result = await fn(fetchParams);
                setData(result);
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [fn] //Memoize fci to ensure stability
    );

    //fetch data on component mount (unless skip)
    useEffect(() => {
        if (!skip) {
            fetchData(params);
        }
    }, []);

    const refetch = async (newParams: P) => await fetchData(newParams);

    return { data, loading, error, refetch };
};