"use client";

import { useState } from "react";

interface AccountActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function AccountActions({
  onEdit,
  onDelete,
}: AccountActionsProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <button onClick={onEdit} className="text-blue-500">
        Edit
      </button>
      <button
        onClick={() => setShowConfirmation(true)}
        className="text-red-500"
      >
        Delete
      </button>

      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="mb-4 text-center">
              Are you sure you want to delete this account?
            </p>
            <div className="flex justify-between">
              <button
                onClick={onDelete}
                className="btn-primary text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn-secondary text-gray-700 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}