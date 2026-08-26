import { useEffect, useState } from "react";

function normalizeLoaderResult(result, initialValue) {
  if (Array.isArray(initialValue)) {
    if (Array.isArray(result)) {
      return { value: result, invalid: false };
    }
    return { value: [], invalid: true };
  }

  if (
    initialValue !== null &&
    typeof initialValue === "object" &&
    !Array.isArray(initialValue)
  ) {
    if (result !== null && typeof result === "object" && !Array.isArray(result)) {
      return { value: result, invalid: false };
    }
    return { value: initialValue, invalid: true };
  }

  return { value: result, invalid: false };
}

export function useAsyncData(loader, initialValue = null, dependencies = []) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    setData(initialValue);

    loader()
      .then((result) => {
        if (!active) {
          return;
        }

        const { value, invalid } = normalizeLoaderResult(result, initialValue);

        if (invalid) {
          console.error("Unexpected API response shape", { result, initialValue });
          setError(new Error("Unexpected API response shape"));
        }

        setData(value);
      })
      .catch((err) => {
        if (active) {
          console.error(err);
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, dependencies);

  return {
    data,
    setData,
    loading,
    error,
  };
}
