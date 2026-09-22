import { useEffect, useState } from "react";
import { useApi } from "api";

export default function useQuestionAttachment({ questionId, fileName, extension }) {
  const [src, setSrc] = useState(null);
  const [status, setStatus] = useState("idle");
  const api = useApi();

  useEffect(() => {
    if (!fileName || questionId == null || !extension) {
      setSrc(null);
      setStatus("idle");
      return undefined;
    }

    let objectUrl = null;
    let cancelled = false;
    setSrc(null);
    setStatus("loading");

    (async () => {
      try {
        const response = await api.post(
          "olympicQuestion/downloadImage",
          { id: questionId },
          { responseType: "blob" }
        );
        if (cancelled) return;
        objectUrl = URL.createObjectURL(new Blob([response.data]));
        setSrc(objectUrl);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setSrc(null);
        setStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [questionId, fileName, extension]);

  return { src, status };
}
