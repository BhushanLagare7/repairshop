import { LoaderCircleIcon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80">
      <div className="grid place-content-center w-full h-dvh">
        <LoaderCircleIcon className="animate-spin size-12 text-foreground/20" />
      </div>
    </div>
  );
};

export default LoadingPage;
