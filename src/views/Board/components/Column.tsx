import axios from 'axios';
import { FC, useContext, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { APIAddTaskPayload, APIColumnData } from '../../../interfaces';
import { AuthContext } from '../../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';
import { Task } from './Task';
import { DragColumnData, Draggable, DragTaskData } from '../../../types';

export interface IColumn {
  boardId: string;
  column: APIColumnData;
  swapColumns: (dragColumnId: string, hoverColumnId: string) => void;
  swapTasks: (dragTaskId: string, hoverTaskId: string) => void;
  moveTask: (dragTaskId: string, toColumnId: string) => void;
  commitOrderChanges: () => void;
}

export const Column: FC<IColumn> = ({
  column: { id, order, tasks, title },
  boardId,
  swapColumns,
  swapTasks,
  moveTask,
  commitOrderChanges,
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const { authInfo } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const currentBoardEndpoint = `boards/${boardId}`;
  const tasksEndpoint = `boards/${boardId}/columns/${id}/tasks`;

  const addTaskMutation = useMutation<unknown, unknown, APIAddTaskPayload>(
    ({ title, order, description, userId }) =>
      axios.post(tasksEndpoint, {
        title,
        order,
        description,
        userId,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([currentBoardEndpoint]);
      },
      // TODO: toaster
      onError: (error) => console.log(error),
    }
  );

  const onAddTaskClick = () => {
    addTaskMutation.mutate({
      title: 'task name',
      order: tasks.length,
      description: 'task desc',
      userId: authInfo!.userId, // TODO check null
    });
  };

  const [, dropTask] = useDrop<DragTaskData>({
    accept: Draggable.Task,
    hover(item) {
      const dragedTaskId = item.id;

      moveTask(dragedTaskId, id);
    },
  });

  const [, drop] = useDrop<DragColumnData>({
    accept: Draggable.Column,
    hover(item) {
      const dragedColumnId = item.id;
      const hoverColumnId = id;

      if (dragedColumnId === hoverColumnId) {
        return;
      }

      swapColumns(dragedColumnId, hoverColumnId);
    },
    drop: () => commitOrderChanges(),
  });

  const [{ isDragging }, drag] = useDrag<DragColumnData, unknown, { isDragging: boolean }>({
    type: Draggable.Column,
    item: () => {
      return { id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(dropTask(ref)));

  return (
    <div
      ref={ref}
      className={classNames(isDragging ? 'bg-[#0001]' : 'bg-[#0003]')}
      style={{ order }}
    >
      <div className={classNames('flex p-1 gap-1 flex-col', isDragging && 'opacity-0')}>
        <span>title: {title}</span>
        <span>order: {order}</span>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            swapTasks={swapTasks}
            commitOrderChanges={commitOrderChanges}
          />
        ))}
        <button className="bg-[#aaa] p-1 rounded-sm" onClick={onAddTaskClick}>
          {t('addTask')}
        </button>
      </div>
    </div>
  );
};
