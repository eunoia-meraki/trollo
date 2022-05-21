import { type FC, Fragment, useState, createContext, ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { Transition, Dialog } from '@headlessui/react';

import { XIcon } from '@heroicons/react/solid';

interface IConfirmationModalProvider {
  children: ReactElement;
}

interface IConfirmHandler {
  handleConfirm: () => void;
}

export const ConfirmationModalProvider: FC<IConfirmationModalProvider> = ({ children }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('');
  const [confirmHandler, setConfirmHandler] = useState<IConfirmHandler>({
    handleConfirm: () => {},
  });

  const openModal = (action: string, handleConfirm: () => void): void => {
    setConfirmHandler({ handleConfirm });
    setAction(action);
    setIsOpen(true);
  };

  const closeModal = (): void => setIsOpen(false);

  const confirm = (): void => {
    const { handleConfirm } = confirmHandler;
    handleConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <ConfirmationModalContext.Provider
        value={{
          openModal: openModal,
        }}
      >
        {children}
      </ConfirmationModalContext.Provider>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button
                      className="w-5 h-5 hover:opacity-75 transition-opacity"
                      onClick={closeModal}
                    >
                      <XIcon />
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-xl text-center">
                      {t('confirmationModal.areYouSureYouWantTo')} {action}?
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      type="button"
                      className="box-border inline-flex justify-center rounded-md border border-transparent bg-blue-700 w-32 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
                      onClick={confirm}
                    >
                      {t('confirmationModal.yes')}
                    </button>

                    <button
                      type="button"
                      className="box-border inline-flex justify-center rounded-md border border-gray-300 bg-white w-32 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      {t('confirmationModal.no')}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

interface IConfirmationModalContext {
  openModal: (action: string, handleConfirm: () => void) => void;
}

const defaultContext: IConfirmationModalContext = {
  openModal: () => {},
};

export const ConfirmationModalContext = createContext<IConfirmationModalContext>(defaultContext);
