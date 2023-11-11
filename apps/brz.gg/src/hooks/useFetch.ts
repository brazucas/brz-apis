import { useEffect, useState } from "react";

const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setError(data.error);
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
