import Button from "./Button";

function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">

        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black !p-1 !min-h-0 !min-w-0 !bg-transparent"
          aria-label="Close"
        >
          ✕
        </Button>

        {title && (
          <h2 className="text-2xl font-bold mb-6">
            {title}
          </h2>
        )}

        <div>
          {children}
        </div>

      </div>

    </div>
  );
}

export default Modal;