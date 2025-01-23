interface ConfirmPopupProps {
  title: string;
  message: string;
  cancelButtonText: string;
  confirmButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPopup = ({ title, message, cancelButtonText, confirmButtonText, onConfirm, onCancel }: ConfirmPopupProps) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{ title }</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{ message }</p>
        <div className="flex justify-between space-x-4 mt-4">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            {cancelButtonText}
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;