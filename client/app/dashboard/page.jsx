import FileUploadComponent from "../components/file-upload";
import ChatComponent from "../components/chat";

export default function Dashboard() {
  return (
    <div className="h-[calc(100vh-80px)] flex px-10 py-6 gap-6">
      <div className="w-[30%] bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 flex items-center justify-center">
        <FileUploadComponent />
      </div>

      <div className="w-[70%] bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex flex-col overflow-hidden">
        <ChatComponent />
      </div>
    </div>
  );
}
