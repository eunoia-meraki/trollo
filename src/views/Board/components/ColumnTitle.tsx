import type { FC, FocusEvent, DragEvent } from 'react';
import { useState } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import axios from 'axios';

import classNames from 'classnames';

interface APIEditColumnPayload {
  title: string;
  order: number;
}

interface IColumnTitle {
  isDragging: boolean;
  title: string;
  order: number;
  id: string;
  boardId: string;
}

export const ColumnTitle: FC<IColumnTitle> = ({ isDragging, order, title, id, boardId }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [titleState, setTitleState] = useState(title);

  const queryClient = useQueryClient();

  const editColumnMutation = useMutation<unknown, unknown, APIEditColumnPayload>(
    ({ title, order }) =>
      axios.put(`boards/${boardId}/columns/${id}`, {
        title,
        order,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([`boards/${boardId}`]),

      // TODO: toaster
      onError: (error) => console.log(error),
    }
  );

  const handleClick = (): void => {
    if (!isEdited) {
      setIsEdited(true);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setIsEdited(false);

    const inputValue = e.target.value;

    if (inputValue) {
      setTitleState(e.target.value);

      editColumnMutation.mutate({
        title: e.target.value,
        order: order,
      });
    }
  };

  const handleDragStart = (e: DragEvent<HTMLInputElement>): void => e.preventDefault();

  const handleRef = (ref: HTMLInputElement | null): void => ref?.focus();

  return (
    <div className={classNames('flex flex-col px-2', isDragging && 'opacity-0')}>
      {isEdited ? (
        <input
          type="text"
          draggable
          onDragStart={handleDragStart}
          onBlur={handleBlur}
          ref={handleRef}
          defaultValue={titleState}
        />
      ) : (
        <span className="cursor-pointer hover:bg-[#aaa]" onClick={handleClick}>
          {titleState}
        </span>
      )}
      <span>order: {order}</span>
    </div>
  );
};
