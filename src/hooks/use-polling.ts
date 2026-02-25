import { useEffect } from "react";
import { useRouter } from "next/navigation";

type PollingOptions = {
  searchParam: string | null;
  ms?: number;
};

export const usePolling = ({ searchParam, ms = 60_000 }: PollingOptions) => {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!searchParam) {
        router.refresh();
      }
    }, ms);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we want to run this effect only when ms or searchParam changes
  }, [ms, searchParam]);
};
