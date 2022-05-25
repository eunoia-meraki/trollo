import axios, { type AxiosResponse } from 'axios';

import type { FC, FocusEvent, DragEvent } from 'react';
import { useState, useContext } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';

import classNames from 'classnames';

import { TrashIcon } from '@heroicons/react/solid';

import type { APIColumnData, APIError } from '../../../interfaces';

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
    APIError,
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
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const deleteColumnMutation = useMutation<unknown, APIError>(
    () => axios.delete(`boards/${boardId}/columns/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`boards/${boardId}`]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleSpanClick = (): void => {
    setIsEditing(true);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    if (inputValue && inputValue !== titleState) {
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
    <div className={classNames('flex flex-col font-light', isDragging && 'opacity-0')}>
      <div className="flex gap-1 p-1 rounded hover:bg-gray-100 group">
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
          <span className="w-full rounded cursor-pointer" onClick={handleSpanClick}>
            {titleState}
          </span>
        )}
        <button
          className="w-6 p-1 rounded text-gray-500 hover:bg-gray-200 invisible group-hover:visible shrink-0"
          type="button"
          onClick={handleButtonClick}
        >
          <TrashIcon />
        </button>
      </div>
      <span className="text-xs p-1">order: {order}</span>
    </div>
  );
};
