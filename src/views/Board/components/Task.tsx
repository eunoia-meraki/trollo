import { UserIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import stc from 'string-to-color';
import { APITaskData } from '../../../interfaces';
import { Draggable, DragTaskData } from '../../../types';
import { TaskTitle } from './TaskTitle';

export interface ITask {
  task: APITaskData & { userName?: string };
  columnId: string;
  boardId: string;
  swapTasks: (dragTaskId: string, hoverTaskId: string) => void;
  commitOrderChanges: () => void;
  isDragging?: boolean;
}

export const Task: FC<ITask> = ({
  task,
  columnId,
  boardId,
  swapTasks,
  commitOrderChanges,
  isDragging = false,
}) => {
  const { id, order } = task;

  const [, dragTask] = useDrag<DragTaskData>({
    type: Draggable.Task,
    item: () => ({ id, columnId }),
    end: commitOrderChanges,
  });

  const [, dropTask] = useDrop<DragTaskData>({
    accept: Draggable.Task,
    hover: (item) => swapTasks(item.id, id),
  });

  return (
    <>
      <div
        ref={(node) => dragTask(dropTask(node))}
        className="p-1 rounded border bg-white"
        style={{ order }}
      >
        <div className={classNames(isDragging && 'opacity-0')}>
          <TaskTitle task={task} columnId={columnId} boardId={boardId} />
          <div
            className="ml-auto bg-gray-100 rounded-full w-5 h-5 border cursor-help overflow-hidden"
            style={{ color: stc(task.userId) }}
            title={task.userName}
          >
            <UserIcon className="m-[-2.5px]" />
          </div>
        </div>
      </div>
    </>
  );
};
