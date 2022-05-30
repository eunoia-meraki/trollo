import axios from 'axios';

import classNames from 'classnames';

import { FC, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { PlusIcon } from '@heroicons/react/solid';

import { APIAddTaskPayload, APIColumnData, APIError, APIUsersData } from '../../../interfaces';
import { AddItemModalContext } from '../../../components/AddItemModalProvider';
import { AuthContext } from '../../../context/AuthProvider';

import { Task } from './Task';
import { ColumnTitle } from './ColumnTitle';
import { Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd';

export interface IColumn {
  boardId: string;
  column: APIColumnData;
  usersData?: APIUsersData;
  provided: DraggableProvided;
}

export const Column: FC<IColumn> = ({ column, boardId, usersData, provided }) => {
  const { id, tasks } = column;

  const { t } = useTranslation();

  const { authInfo } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const currentBoardEndpoint = `boards/${boardId}`;
  const tasksEndpoint = `boards/${boardId}/columns/${id}/tasks`;

  const addTaskMutation = useMutation<unknown, APIError, APIAddTaskPayload>(
    ({ title, description, userId }) =>
      axios.post(tasksEndpoint, {
        title,
        description,
        userId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([currentBoardEndpoint]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const { openModal } = useContext(AddItemModalContext);

  const addTask = (title: string, description: string): void => {
    addTaskMutation.mutate({
      title: title,
      description: description,
      userId: authInfo?.userId || '',
    });
  };

  const onAddTaskButtonClick = (): void => {
    openModal('task', addTask);
  };

  return (
    <div
      className={`w-[300px] h-full overflow-hidden bg-gray-50 shadow rounded-sm`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div
        className={'flex flex-col gap-2 p-2 max-h-full overflow-hidden bg-white border rounded-sm'}
      >
        <div className={classNames('flex flex-col gap-2 overflow-hidden')}>
          <ColumnTitle column={column} boardId={boardId} />

          <Droppable droppableId={column.id} key={column.id} type="COLUMN">
            {(provided) => (
              <div
                className={classNames('flex flex-col gap-2 overflow-y-auto min-h-[10px]')}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <Task
                        boardId={boardId}
                        columnId={column.id}
                        task={{
                          ...task,
                          userName: usersData?.find((user) => user.id == task.userId)?.name,
                        }}
                        provided={provided}
                        isDragging={snapshot.isDragging}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className={classNames('w-full')}>
            <button
              className={`w-full flex gap-1 py-2.5 pl-2 pr-5 text-sm font-medium text-gray-900
                focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100
              hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200`}
              onClick={onAddTaskButtonClick}
            >
              <PlusIcon className="w-5 h-5" />
              {t('addTask')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
