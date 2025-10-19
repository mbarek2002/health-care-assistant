const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-4 justify-start animate-fade-in">
      <div className="max-w-[80%] sm:max-w-[70%] rounded-2xl rounded-bl-sm px-4 py-3 bg-[hsl(var(--chat-assistant-bg))] border border-border shadow-sm">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
