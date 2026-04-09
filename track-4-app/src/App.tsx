import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  // =============================
  // STATE
  // =============================
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // =============================
  // CONVEX ACTIONS
  // =============================
  const extractText = useAction(api.ocr.extractText);
  const processVoice = useAction(api.voice.processVoice);

  // =============================
  // OCR HANDLER
  // =============================
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      setLoading(true);

      try {
        const result = await extractText({
          base64Image: base64,
          mimeType: file.type,
        });

        setOutput(result);
      } catch (error) {
        console.error(error);
        setOutput("Error extracting text");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // =============================
  // VOICE HANDLER
  // =============================
  const handleVoice = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      setInput(transcript);
      setLoading(true);

      try {
        const result = await processVoice({ transcript });
        setOutput(result);
      } catch (error) {
        console.error(error);
        setOutput("Error processing voice");
      }

      setLoading(false);
    };

    recognition.start();
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Advanced API App (Answer Key)
        </h1>

        {/* INPUT */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Voice input will appear here..."
          className="w-full border p-2 rounded mb-3"
        />

        {/* BUTTONS */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* VOICE */}
          <button
            onClick={handleVoice}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Use Voice
          </button>

          {/* OCR */}
          <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* OUTPUT */}
        <div className="border p-3 rounded bg-gray-50 min-h-[100px]">
          {loading ? "Loading..." : output || "Result will appear here"}
        </div>
      </div>
    </div>
  );
}
