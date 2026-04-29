import { useState, useEffect } from 'react';

export function useMovies(apiCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiCall) {
      setLoading(false);
      setError(null);
      setData(null);
      return;
    }

    let isActive = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        if (isActive) {
          setData(response.data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err.response?.data?.status_message ||
            'Erro ao carregar dados. Verifique sua chave de API.'
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [apiCall]);

  return { data, loading, error };
}
