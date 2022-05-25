import type { FC, FocusEvent, DragEvent } from 'react';
import { useState, useContext } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import axios, { type AxiosResponse } from 'axios';

import { TrashIcon } from '@heroicons/react/solid';

import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import { APITaskData } from '../../../interfaces';

import { AuthContext } from '../../../context/AuthProvider';

import { ConfirmationModalContext } from '../../../components/ConfirmationModalProvider';

interface APIEditTaskPayload {
  title: string;
  description: string;
  order: number;
  boardId: string;
  userId: string;
}

interface APIEditTaskResponse {
  title: string;
  description: string;
  order: number;
  id: string;
  boardId: string;
  userId: string;
}

interface ITaskTitle {
  isDragging: boolean;
  isMoving: boolean;
  task: APITaskData;
  columnId: string;
  boardId: string;
}

export const TaskTitle: FC<ITaskTitle> = ({
  isDragging,
  isMoving,
  task: { id, title, order },
  columnId,
  boardId,
}) => {
  const { t } = useTranslation();

  const { authInfo } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [titleState, setTitleState] = useState(title);

  const queryClient = useQueryClient();

  const editTaskMutation = useMutation<
    AxiosResponse<APIEditTaskResponse>,
    unknown,
    APIEditTaskPayload
  >(
    ({ title, description, order, boardId, userId }) =>
      axios.put(`boards/${boardId}/columns/${columnId}/tasks/${id}`, {
        title,
        description,
        order,
        boardId,
        userId,
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

  const deleteColumnMutation = useMutation(
    () => axios.delete(`boards/${boardId}/columns/${columnId}/tasks/${id}`),
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

  const handleSpanClick = (): void => {
    setIsEditing(true);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    if (inputValue && inputValue !== titleState) {
      setTitleState(inputValue);

      editTaskMutation.mutate({
        title: inputValue,
        description: 'task_desc', //TODO fix desc
        order: order,
        boardId: boardId,
        userId: authInfo!.userId, // TODO check null
      });
    }

    setIsEditing(false);
  };

  const handleInputDragStart = (e: DragEvent<HTMLInputElement>): void => e.preventDefault();

  const handleInputRef = (ref: HTMLInputElement | null): void => ref?.focus();

  const { openModal } = useContext(ConfirmationModalContext);

  const handleButtonClick = (): void => {
    openModal(t('confirmationModal.deleteTask'), () => {
      deleteColumnMutation.mutate();
    });
  };

  return (
    <div
      className={classNames('flex flex-col font-light', (isDragging || isMoving) && 'opacity-50')}
    >
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
          className="w-6 p-1 text-gray-500 hover:bg-gray-200 invisible group-hover:visible shrink-0"
          type="button"
          onClick={handleButtonClick}
        >
          <TrashIcon />
        </button>
      </div>
      {/* //TODO add desc <span>{description}</span> */}
      <span className="text-xs p-1">order: {order}</span>
    </div>
  );
};
