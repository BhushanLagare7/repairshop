import { cn } from "@/lib/utils";

type DisplayServerActionResponseProps = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    validationErrors?: Record<string, string[] | undefined>;
  };
};

const MessageBox = ({
  type,
  content,
}: {
  type: "error" | "success";
  content: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-accent px-4 py-2 my-2 rounded-lg border",
        type === "error" && "text-red-500",
      )}
    >
      {type === "success" ? "🎉" : "🚨"} {content}
    </div>
  );
};

export const DisplayServerActionResponse = ({
  result,
}: DisplayServerActionResponseProps) => {
  const { data, serverError, validationErrors } = result;
  return (
    <div>
      {data?.message && (
        <MessageBox content={`Success: ${data.message}`} type="success" />
      )}
      {serverError && <MessageBox content={serverError} type="error" />}
      {validationErrors && (
        <MessageBox
          content={Object.keys(validationErrors).map((key) => (
            <p key={key}>
              {`${key}: ${validationErrors[key as keyof typeof validationErrors]}`}
            </p>
          ))}
          type="error"
        />
      )}
    </div>
  );
};
