
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <Loader2 className="h-16 w-16 text-success-500 animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Chargement...</p>
    </div>
  );
};

export default Loading;
