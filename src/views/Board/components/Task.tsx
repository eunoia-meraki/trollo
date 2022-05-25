import { UserIcon } from '@heroicons/react/solid';
import { FC, useRef } from 'react';
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
  isMoving?: boolean;
}

export const Task: FC<ITask> = ({
  task,
  columnId,
  boardId,
  swapTasks,
  commitOrderChanges,
  isMoving = false,
}) => {
  const { id, order } = task;

  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragTaskData>({
    accept: Draggable.Task,
    hover(item) {
      const dragedTaskId = item.id;
      const hoverTaskId = id;

      swapTasks(dragedTaskId, hoverTaskId);
    },
    drop: () => commitOrderChanges(),
  });

  const [{ isDragging }, drag] = useDrag<DragTaskData, unknown, { isDragging: boolean }>({
    type: Draggable.Task,
    item: () => {
      return { id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <>
      <div ref={ref} className="p-1 rounded border bg-white" style={{ order }}>
        <TaskTitle
          isDragging={isDragging}
          isMoving={isMoving}
          task={task}
          columnId={columnId}
          boardId={boardId}
        />
        <div
          className="ml-auto bg-gray-100 rounded-full w-5 h-5 border cursor-help overflow-hidden"
          style={{ color: stc(task.userId) }}
          title={task.userName}
        >
          <UserIcon className="m-[-2.5px]" />
        </div>
      </div>
    </>
  );
};
