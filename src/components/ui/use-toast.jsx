import React, { useState } from "react";

const Toast = ({ message, onClose }) => (
  <div className="toast">
    {message}
    <button onClick={onClose}>Close</button>
  </div>
);

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000); // auto-close after 3 seconds
  };

  return {
    toast: toast && <Toast message={toast} onClose={() => setToast(null)} />,
    showToast,
  };
};
