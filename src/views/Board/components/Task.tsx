import type { FC, FocusEvent, DragEvent } from 'react';
import { useState, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { UserIcon, TrashIcon } from '@heroicons/react/solid';

import classNames from 'classnames';

import autosize from 'autosize';

import axios, { type AxiosResponse } from 'axios';

import stc from 'string-to-color';

import {
  APITaskData,
  APIError,
  APIEditTaskResponse,
  APIEditTaskPayload,
} from '../../../interfaces';

import { AuthContext } from '../../../context/AuthProvider';
import { ConfirmationModalContext } from '../../../components/ConfirmationModalProvider';
import { DraggableProvided } from 'react-beautiful-dnd';

export interface ITask {
  task: APITaskData & { userName?: string };
  columnId: string;
  boardId: string;
  provided: DraggableProvided;
  isDragging: boolean;
}

export const Task: FC<ITask> = ({ task, columnId, boardId, provided, isDragging = false }) => {
  const { id, title, description, order, userId, userName } = task;

  const { t } = useTranslation();

  const { authInfo } = useContext(AuthContext);

  const [titleIsEditing, setTitleIsEditing] = useState(false);
  const [descriptionIsEditing, setDescriptionIsEditing] = useState(false);
  const [titleState, setTitleState] = useState(title);
  const [descriptionState, setDescriptionState] = useState(description);

  const queryClient = useQueryClient();

  const editTaskMutation = useMutation<
    AxiosResponse<APIEditTaskResponse>,
    APIError,
    APIEditTaskPayload
  >(
    ({ title, description, order, boardId, userId }) =>
      axios.put(`boards/${boardId}/columns/${columnId}/tasks/${id}`, {
        title,
        description,
        order,
        boardId,
        userId,
        columnId,
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

  const deleteTaskMutation = useMutation<unknown, APIError>(
    () => axios.delete(`boards/${boardId}/columns/${columnId}/tasks/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`boards/${boardId}`]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleTitleClick = (): void => {
    setTitleIsEditing(true);
  };

  const handleDescriptionClick = (): void => {
    setDescriptionIsEditing(true);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    if (inputValue && inputValue !== titleState) {
      setTitleState(inputValue);

      editTaskMutation.mutate({
        title: inputValue,
        description: descriptionState,
        order: order,
        boardId: boardId,
        userId: authInfo?.userId || '',
        columnId,
      });
    }

    setTitleIsEditing(false);
  };

  const handleTextAreaBlur = (e: FocusEvent<HTMLTextAreaElement>): void => {
    const textAreaValue = e.target.value;

    if (textAreaValue && textAreaValue !== descriptionState) {
      setDescriptionState(textAreaValue);

      editTaskMutation.mutate({
        title: titleState,
        description: textAreaValue,
        order: order,
        boardId: boardId,
        userId: authInfo?.userId || '',
        columnId,
      });
    }

    setDescriptionIsEditing(false);
  };

  const handleInputDragStart = (e: DragEvent<HTMLInputElement>): void => {
    e.preventDefault();
  };

  const handleTextAreaDragStart = (e: DragEvent<HTMLTextAreaElement>): void => {
    e.preventDefault();
  };

  const handleInputRef = (ref: HTMLInputElement | null): void => {
    ref?.focus();
  };

  const handleTextAreaRef = (ref: HTMLTextAreaElement | null): void => {
    ref?.focus();
    ref && autosize(ref);
  };

  const { openModal } = useContext(ConfirmationModalContext);

  const handleButtonClick = (): void => {
    openModal(t('confirmationModal.deleteTask'), () => {
      deleteTaskMutation.mutate();
    });
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-1 rounded border ${isDragging ? 'bg-blue-100' : 'bg-white'}`}
    >
      <div className={classNames('flex flex-col font-light')}>
        <div className="flex gap-1 p-1 rounded hover:bg-gray-100 group">
          {titleIsEditing ? (
            <input
              className="w-full text-sm font-semibold"
              type="text"
              draggable
              onDragStart={handleInputDragStart}
              onBlur={handleInputBlur}
              ref={handleInputRef}
              defaultValue={titleState}
            />
          ) : (
            <span
              className="w-full text-sm leading-6 cursor-pointer font-semibold break-all"
              onClick={handleTitleClick}
            >
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

        {descriptionIsEditing ? (
          <textarea
            className="p-1 text-sm"
            draggable
            onDragStart={handleTextAreaDragStart}
            onBlur={handleTextAreaBlur}
            ref={handleTextAreaRef}
            defaultValue={descriptionState}
            maxLength={300}
          />
        ) : (
          <div
            className="p-1 text-sm rounded cursor-pointer hover:bg-gray-100 break-all"
            onClick={handleDescriptionClick}
          >
            {descriptionState}
          </div>
        )}
      </div>

      <div
        className="ml-auto bg-gray-100 rounded-full w-5 h-5 border cursor-help overflow-hidden"
        style={{ color: stc(userId) }}
        title={userName}
      >
        <UserIcon className="m-[-2.5px]" />
      </div>
    </div>
  );
};
