import { PianoKeyboard } from "./components/PianoKeyboard";

export default function App() {
  return (
    <div className="fixed inset-0 flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      <PianoKeyboard />
    </div>
  );
}
