import type { FC, FocusEvent, DragEvent } from 'react';
import { useState, useContext } from 'react';

import { useMutation } from 'react-query';

import axios, { AxiosResponse } from 'axios';

import classNames from 'classnames';

import { APITaskData } from '../../../interfaces';

import { AuthContext } from '../../../context/AuthProvider';

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
  const { authInfo } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [titleState, setTitleState] = useState(title);
  const [prevTitleState, setPrevTitleState] = useState(title);

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
      onSuccess: ({ data: { title } }) => {
        setPrevTitleState(title);
      },
      // TODO: toaster
      onError: (error) => {
        setTitleState(prevTitleState);
        console.log(error);
      },
    }
  );

  const handleClick = (): void => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    if (inputValue) {
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

  const handleDragStart = (e: DragEvent<HTMLInputElement>): void => e.preventDefault();

  const handleRef = (ref: HTMLInputElement | null): void => ref?.focus();

  return (
    <div
      className={classNames('flex flex-col font-light', (isDragging || isMoving) && 'opacity-50')}
    >
      {isEditing ? (
        <input
          type="text"
          draggable
          onDragStart={handleDragStart}
          onBlur={handleBlur}
          ref={handleRef}
          defaultValue={titleState}
        />
      ) : (
        <span className="cursor-pointer hover:bg-gray-100" onClick={handleClick}>
          {titleState}
        </span>
      )}
      {/* <span>{description}</span> */}
      <span className="text-xs">order: {order}</span>
    </div>
  );
};
