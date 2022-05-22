import classNames from 'classnames';
import { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { APITaskData } from '../../../interfaces';
import { Draggable, DragTaskData } from '../../../types';
import { TaskTitle } from './TaskTitle';

export interface ITask {
  task: APITaskData;
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
      <div
        ref={ref}
        className={classNames('p-2 rounded-sm', isDragging ? 'bg-[#0001]' : 'bg-[#0003]')}
        style={{ order }}
      >
        <TaskTitle
          isDragging={isDragging}
          isMoving={isMoving}
          task={task}
          columnId={columnId}
          boardId={boardId}
        />
      </div>
    </>
  );
};
