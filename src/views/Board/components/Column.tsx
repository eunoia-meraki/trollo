import axios from 'axios';

import classNames from 'classnames';

import { FC, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';

import { PlusIcon } from '@heroicons/react/solid';

import { APIAddTaskPayload, APIColumnData, APIError, APIUsersData } from '../../../interfaces';
import { DragColumnData, Draggable, DragTaskData } from '../../../types';
import { AddItemModalContext } from '../../../components/AddItemModalProvider';
import { AuthContext } from '../../../context/AuthProvider';

import { Task } from './Task';
import { ColumnTitle } from './ColumnTitle';

export interface IColumn {
  boardId: string;
  column: APIColumnData;
  usersData?: APIUsersData;
  swapColumns: (dragColumnId: string, hoverColumnId: string) => void;
  swapTasks: (dragTaskId: string, hoverTaskId: string) => void;
  moveTask: (dragTaskId: string, toColumnId: string) => void;
  commitOrderChanges: () => void;
}

export const Column: FC<IColumn> = ({
  column,
  boardId,
  usersData,
  swapColumns,
  swapTasks,
  moveTask,
  commitOrderChanges,
}) => {
  const { id, order, tasks } = column;

  const { t } = useTranslation();

  const { authInfo } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const currentBoardEndpoint = `boards/${boardId}`;
  const tasksEndpoint = `boards/${boardId}/columns/${id}/tasks`;

  const addTaskMutation = useMutation<unknown, APIError, APIAddTaskPayload>(
    ({ title, order, description, userId }) =>
      axios.post(tasksEndpoint, {
        title,
        order,
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

  const [{ id: dragTaskId }, dropTask] = useDrop<DragTaskData, unknown, DragTaskData>({
    accept: Draggable.Task,
    hover: (item) => moveTask(item.id, id),
    collect: (monitor) => ({ id: monitor.getItem()?.id }),
  });

  const [{ isDragging }, dragColumn] = useDrag<DragColumnData, unknown, { isDragging: boolean }>({
    type: Draggable.Column,
    item: () => ({ id }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: commitOrderChanges,
  });

  const [, dropColumn] = useDrop<DragColumnData>({
    accept: Draggable.Column,
    hover: (item) => {
      const dragColumnId = item.id;
      const hoverColumnId = id;

      if (dragColumnId === hoverColumnId) {
        return;
      }

      swapColumns(dragColumnId, hoverColumnId);
    },
  });

  const { openModal } = useContext(AddItemModalContext);

  const addTask = (title: string): void =>
    addTaskMutation.mutate({
      title: title,
      order: tasks.length,
      description: 'task desc',
      userId: authInfo?.userId || '',
    });

  const onAddTaskButtonClick = () => openModal(t('addTask'), addTask);

  return (
    <div
      ref={(node) => dropColumn(dropTask(node))}
      className={'w-[200px] h-full overflow-hidden bg-gray-50 shadow rounded-sm'}
      style={{ order }}
    >
      <div
        ref={dragColumn}
        className={'flex flex-col gap-2 p-2 max-h-full overflow-hidden bg-white border rounded-sm'}
      >
        <div
          className={classNames('flex flex-col gap-2 overflow-hidden', isDragging && 'opacity-0')}
        >
          <ColumnTitle column={column} boardId={boardId} />

          <div className={classNames('flex flex-col gap-2 overflow-y-auto')}>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={{
                  ...task,
                  userName: usersData?.find((user) => user.id == task.userId)?.name,
                }}
                columnId={id}
                boardId={boardId}
                isDragging={dragTaskId === task.id}
                swapTasks={swapTasks}
                commitOrderChanges={commitOrderChanges}
              />
            ))}
          </div>

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
