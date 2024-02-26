import { SendHorizontal } from "lucide-react";

const InterviewChatInput = ({
  chatText,
  setChatText,
  onSend,
  isSending,
}: {
  chatText: string;
  setChatText: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
}) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      onSend();
    }
  };

  return (
    <div className="mt-4 flex items-start justify-start gap-x-2">
      <textarea
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
        className="textarea-bordered textarea-primary textarea w-full focus:outline-offset-0"
        placeholder="Type your message here"
        onKeyUp={handleKeyUp}
        rows={3}
      ></textarea>
      <div className="flex flex-col gap-x-2 gap-y-2">
        <div>
          <button
            aria-label="Send"
            className="btn-primary btn flex w-14 flex-col sm:w-36"
            type="submit"
            onClick={() => onSend()}
            disabled={chatText.length === 0 || isSending}
          >
            <SendHorizontal className="h-6 w-6" />
            <p className="hidden text-center  sm:block">
              Send
              <br />
              <span className="text-[8px]">Shift+Enter</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewChatInput;
