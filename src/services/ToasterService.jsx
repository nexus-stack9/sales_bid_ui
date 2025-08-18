// services/ToastService.js
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

// Create a container for toast if not exists
const TOAST_CONTAINER_ID = 'toast-container';
let container = document.getElementById(TOAST_CONTAINER_ID);

if (!container) {
  container = document.createElement('div');
  container.id = TOAST_CONTAINER_ID;
  document.body.appendChild(container);
}

// Toast Styles (can be extended with CSS classes or styled-components)
const toastStyles = {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: '300px',
  fontFamily: 'sans-serif',
};

const toastItemStyles = (type) => {
  const styles = {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.875rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease-out',
    cursor: 'pointer',
    background: '#607D8B',
  };

  switch (type) {
    case 'success':
      styles.background = '#4CAF50';
      break;
    case 'error':
      styles.background = '#F44336';
      break;
    case 'warning':
      styles.background = '#FF9800';
      break;
    case 'info':
      styles.background = '#2196F3';
      break;
    default:
      break;
  }

  return styles;
};

// Animation style injection
const injectStyles = () => {
  const styleId = 'toast-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

injectStyles();

// Toast Component (Internal)
const ToastItem = ({ toast, onClose }) => {
  return (
    <div
      style={toastItemStyles(toast.type)}
      onClick={() => onClose(toast.id)}
      role="alert"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
};

// Main Toast Service Component (Internal)
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    // Cleanup: auto-remove toasts
    const timers = toasts.map((toast) => {
      const timer = setTimeout(() => removeToast(toast.id), toast.duration);
      return timer;
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div style={toastStyles}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Render ToastContainer into DOM
const renderToastContainer = () => {
  const element = document.createElement('div');
  container.appendChild(element);
  ReactDOM.render(<ToastContainer />, element);

  return () => {
    ReactDOM.unmountComponentAtNode(element);
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };
};

// Initialize once
let cleanup = null;
const ensureToastContainer = () => {
  if (!cleanup) {
    cleanup = renderToastContainer();
  }
};

ensureToastContainer();

// 🔥 Public Toast Service API
export const ToastService = {
  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  },
  error(message, duration = 3000) {
    this.show(message, 'error', duration);
  },
  warning(message, duration = 3000) {
    this.show(message, 'warning', duration);
  },
  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  },
  show(message, type = 'info', duration = 3000) {
    // Re-render ToastContainer to reflect new state
    const id = Date.now() + Math.random();
    const container = document.getElementById(TOAST_CONTAINER_ID);
    const toastContainer = container.querySelector('.toast-root') || document.createElement('div');

    if (!toastContainer.classList.contains('toast-root')) {
      toastContainer.className = 'toast-root';
      container.appendChild(toastContainer);
    }

    // Use React to re-render with new toast
    const ToastList = () => {
      const [toasts, setToasts] = useState([]);

      useEffect(() => {
        const newToast = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);

        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);

        return () => clearTimeout(timer);
      }, []);

      if (toasts.length === 0) return null;

      return (
        <div style={toastStyles}>
          {toasts.map((t) => (
            <div
              key={t.id}
              style={toastItemStyles(t.type)}
              onClick={() => setToasts([])}
              role="alert"
              aria-live="polite"
            >
              {t.message}
            </div>
          ))}
        </div>
      );
    };

    ReactDOM.render(<ToastList />, toastContainer);
  },
};