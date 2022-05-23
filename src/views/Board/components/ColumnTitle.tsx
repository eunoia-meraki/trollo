import type { FC, FocusEvent, DragEvent } from 'react';
import { useState } from 'react';

import { useMutation } from 'react-query';

import axios, { AxiosResponse } from 'axios';

import classNames from 'classnames';

import { APIColumnData } from '../../../interfaces';

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
  const [isEditing, setIsEditing] = useState(false);
  const [titleState, setTitleState] = useState(title);
  const [prevTitleState, setPrevTitleState] = useState(title);

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
      onSuccess: ({ data: { title } }) => {
        setPrevTitleState(title);
      },
      onError: (error) => {
        setTitleState(prevTitleState);
        console.log(error);
      },
    }
  );

  const handleClick = (): void => setIsEditing(true);

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
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

  const handleDragStart = (e: DragEvent<HTMLInputElement>): void => e.preventDefault();

  const handleRef = (ref: HTMLInputElement | null): void => ref?.focus();

  return (
    <div className={classNames('flex flex-col px-2', isDragging && 'opacity-0')}>
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
      <span className="text-xs">order: {order}</span>
    </div>
  );
};
