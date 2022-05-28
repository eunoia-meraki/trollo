import { type FC, Fragment, useState, createContext, ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';

import { Transition, Dialog } from '@headlessui/react';

import { XIcon } from '@heroicons/react/solid';

type Item = 'column' | 'task';

interface IAddItemHandler {
  handleAddItem: HandleAddItemFunction;
}

interface IAddModalForm {
  title: string;
  description: string;
}

interface IAddItemModalProvider {
  children: ReactElement;
}

export const AddItemModalProvider: FC<IAddItemModalProvider> = ({ children }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [addItemHandler, setAddItemHandler] = useState<IAddItemHandler>({
    handleAddItem: () => {},
  });
  const [item, setItem] = useState<Item>('column');

  const openModal: OpenModalFunction = (item, handleAddItem) => {
    setItem(item);
    setAddItemHandler({ handleAddItem });
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<IAddModalForm>();

  const onSubmit = handleSubmit(({ title, description }) => {
    const { handleAddItem } = addItemHandler;
    handleAddItem(title, description);
    closeModal();
    reset();
  });

  const title = {
    column: t('addColumn'),
    task: t('addTask'),
  };

  return (
    <>
      <AddItemModalContext.Provider
        value={{
          openModal: openModal,
        }}
      >
        {children}
      </AddItemModalContext.Provider>
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

                  <Dialog.Title as="h3" className="text-xl font-bold text-center">
                    {title[item]}
                  </Dialog.Title>

                  <form onSubmit={onSubmit}>
                    <div>
                      <label className="block">{t('title')}</label>

                      <input
                        type="text"
                        placeholder={t('title')}
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        {...register('title', {
                          required: {
                            value: true,
                            message: t('validationErrors.fieldCanNotBeEmpty'),
                          },
                        })}
                        onChange={() => clearErrors('title')}
                      />

                      {errors.title && (
                        <span className="text-red-500 text-sm">{errors.title.message}</span>
                      )}
                    </div>

                    {item === 'task' && (
                      <div>
                        <label className="block">{t('description')}</label>

                        <input
                          type="text"
                          placeholder={t('description')}
                          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                          {...register('description', {
                            required: {
                              value: true,
                              message: t('validationErrors.fieldCanNotBeEmpty'),
                            },
                          })}
                          onChange={() => clearErrors('description')}
                        />

                        {errors.description && (
                          <span className="text-red-500 text-sm">{errors.description.message}</span>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="mt-4 box-border inline-flex justify-center rounded-md border border-transparent bg-blue-700 w-32 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
                    >
                      {t('continue')}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

type HandleAddItemFunction = (title: string, description: string) => void;

type OpenModalFunction = (item: Item, handleAddItem: HandleAddItemFunction) => void;

interface IAddItemModalContext {
  openModal: OpenModalFunction;
}

const defaultContext: IAddItemModalContext = {
  openModal: () => {},
};

export const AddItemModalContext = createContext<IAddItemModalContext>(defaultContext);
