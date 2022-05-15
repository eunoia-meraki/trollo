import type { FC } from 'react';

import { Toaster as LibToaster, toast, ToastBar } from 'react-hot-toast';

export const Toaster: FC = () => (
  <LibToaster
    reverseOrder={false}
    toastOptions={{
      position: 'top-center',
      success: {
        duration: 4000,
      },
      error: {
        duration: Infinity,
      },
      style: {
        width: '100%',
      },
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => (
          <>
            {icon}
            {message}
            {t.type !== 'loading' && (
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  cursor: 'pointer',
                }}
              >
                x
              </button>
            )}
          </>
        )}
      </ToastBar>
    )}
  </LibToaster>
);
