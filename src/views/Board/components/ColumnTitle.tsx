import axios, { type AxiosResponse } from 'axios';

import type { FC, FocusEvent, DragEvent } from 'react';
import { useState, useContext, useRef } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';

import classNames from 'classnames';

import { TrashIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';

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
  column: APIColumnData;
  boardId: string;
}

export const ColumnTitle: FC<IColumnTitle> = ({ column: { id, title, order }, boardId }) => {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [titleState, setTitleState] = useState(title);

  const inputRef = useRef<HTMLInputElement | undefined>();

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

  const handleSubmitClick = (): void => {
    const inputValue = inputRef.current?.value;

    if (inputValue && inputValue !== titleState) {
      setTitleState(inputValue);

      editColumnMutation.mutate({
        title: inputValue,
        order: order,
      });
    }

    setIsEditing(false);
  };

  const handleCancelClick = (): void => {
    setIsEditing(false);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>): void => {
    if (e.relatedTarget === null) {
      setIsEditing(false);
    }
  };

  const handleInputDragStart = (e: DragEvent<HTMLInputElement>): void => {
    e.preventDefault();
  };

  const handleInputRef = (ref: HTMLInputElement | null): void => {
    if (ref) {
      ref.focus();
      inputRef.current = ref;
    }
  };

  const { openModal } = useContext(ConfirmationModalContext);

  const handleButtonClick = (): void => {
    openModal(t('confirmationModal.deleteColumn'), () => {
      deleteColumnMutation.mutate();
    });
  };

  return (
    <div className={classNames('flex flex-col font-light')}>
      <div className="flex gap-1 p-1 rounded hover:bg-gray-100 group">
        {isEditing ? (
          <div className="flex gap-1 w-full">
            <button
              className="w-6 p-1 rounded text-gray-500 hover:bg-gray-200 shrink-0"
              type="button"
              onClick={handleSubmitClick}
            >
              <CheckCircleIcon />
            </button>
            <button
              className="w-6 p-1 rounded text-gray-500 hover:bg-gray-200 shrink-0"
              type="button"
              onClick={handleCancelClick}
            >
              <XCircleIcon />
            </button>
            <input
              className="w-full text-sm font-semibold pl-1"
              type="text"
              draggable
              onDragStart={handleInputDragStart}
              onBlur={handleInputBlur}
              ref={handleInputRef}
              defaultValue={titleState}
            />
          </div>
        ) : (
          <>
            <span className="w-full font-semibold cursor-pointer" onClick={handleSpanClick}>
              {titleState}
            </span>
            <button
              className="w-6 p-1 rounded text-gray-500 hover:bg-gray-200 invisible group-hover:visible shrink-0"
              type="button"
              onClick={handleButtonClick}
            >
              <TrashIcon />
            </button>
          </>
        )}
      </div>
      <span className="text-xs p-1">order: {order}</span>
    </div>
  );
};
