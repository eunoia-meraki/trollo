import { useContext, type FC } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { useTranslation } from 'react-i18next';

import axios from 'axios';

import classNames from 'classnames';

import { TrashIcon } from '@heroicons/react/solid';

import { APIBoardsData } from '../../interfaces';

import { ConfirmationModalContext } from '../../components/ConfirmationModalProvider';

interface IRemoveBoardButton {
  boardId: string;
}

// TODO: remove Modal?
export const RemoveBoardButton: FC<IRemoveBoardButton> = ({ boardId }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const removeBoardMutation = useMutation(() => axios.delete(`boards/${boardId}`), {
    onSuccess: () => {
      queryClient.setQueryData<APIBoardsData>(
        'boards',
        (old) => old?.filter((board) => board.id != boardId) || []
      );
    },
    onError: (error) => console.log(error), // TODO: toaster
  });

  const { openModal } = useContext(ConfirmationModalContext);

  const removeBoard = (): void => {
    openModal(t('confirmationModal.deleteBoard'), () => removeBoardMutation.mutate());
  };

  return (
    <button
      className={classNames(
        'hover:bg-gray-100',
        'w-8 h-8',
        'p-1 rounded-lg transition-colors text-center justify-center items-center',
        'text-gray-500',
        'focus-visible:ring-gray-300',
        'disabled:bg-opacity-10 disabled:text-label-neutral4/25 ',
        'focus:outline-none focus-visible:ring-2',
        'shrink-0'
      )}
      type="button"
      onClick={removeBoard}
    >
      <TrashIcon />
    </button>
  );
};
