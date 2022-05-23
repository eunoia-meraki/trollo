import type { FC, FocusEvent, DragEvent } from 'react';
import { useState, useContext } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import axios, { type AxiosResponse } from 'axios';

import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import { TrashIcon } from '@heroicons/react/solid';

import type { APIColumnData } from '../../../interfaces';

import { ConfirmationModalContext } from '../../../components/ConfirmationModalProvider';

interface APIEditColumnPayload {
  title: string;
  order: number;
}

interface APIEditColumnResponse {
  title: string;
  order: number;
  id: string;
}

interface IColumnTitle {
  isDragging: boolean;
  column: APIColumnData;
  boardId: string;
}

export const ColumnTitle: FC<IColumnTitle> = ({
  isDragging,
  column: { id, title, order },
  boardId,
}) => {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [titleState, setTitleState] = useState(title);

  const queryClient = useQueryClient();

  const editColumnMutation = useMutation<
    AxiosResponse<APIEditColumnResponse>,
    unknown,
    APIEditColumnPayload
  >(
    ({ title, order }) =>
      axios.put(`boards/${boardId}/columns/${id}`, {
        title,
        order,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`boards/${boardId}`]);
      },
      // TODO: toaster
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const deleteColumnMutation = useMutation(() => axios.delete(`boards/${boardId}/columns/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries([`boards/${boardId}`]);
    },
    // TODO: toaster
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSpanClick = (): void => {
    setIsEditing(true);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    if (inputValue) {
      setTitleState(inputValue);

      editColumnMutation.mutate({
        title: inputValue,
        order: order,
      });
    }

    setIsEditing(false);
  };

  const handleInputDragStart = (e: DragEvent<HTMLInputElement>): void => {
    e.preventDefault();
  };

  const handleInputRef = (ref: HTMLInputElement | null): void => {
    ref?.focus();
  };

  const { openModal } = useContext(ConfirmationModalContext);

  const handleButtonClick = (): void => {
    openModal(t('confirmationModal.deleteColumn'), () => {
      deleteColumnMutation.mutate();
    });
  };

  return (
    <div className={classNames('flex flex-col px-2 font-light', isDragging && 'opacity-0')}>
      <div className="flex gap-1">
        {isEditing ? (
          <input
            className="w-full"
            type="text"
            draggable
            onDragStart={handleInputDragStart}
            onBlur={handleInputBlur}
            ref={handleInputRef}
            defaultValue={titleState}
          />
        ) : (
          <span
            className="w-full rounded cursor-pointer hover:bg-gray-100"
            onClick={handleSpanClick}
          >
            {titleState}
          </span>
        )}
        <button
          className="w-6 p-1 rounded text-gray-500 hover:bg-gray-100 shrink-0"
          type="button"
          onClick={handleButtonClick}
        >
          <TrashIcon />
        </button>
      </div>
      <span>order: {order}</span>
    </div>
  );
};
