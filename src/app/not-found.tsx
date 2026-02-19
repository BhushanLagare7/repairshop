import Image from "next/image";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="px-2 w-full">
      <div className="flex flex-col gap-4 justify-center items-center py-4 mx-auto">
        <h2 className="text-2xl">Page Not Found</h2>
        <Image
          alt="Page Not Found"
          className="m-0 rounded-xl"
          height={300}
          priority
          sizes="300px"
          src="/not-found-1024x1024.png"
          title="Page Not Found"
          width={300}
        />
      </div>
    </div>
  );
}
