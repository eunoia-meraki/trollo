import classNames from 'classnames';
import { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { APITaskData } from '../../../interfaces';
import { Draggable, DragTaskData } from '../../../types';

export interface ITask {
  task: APITaskData;
  swapTasks: (dragTaskId: string, hoverTaskId: string) => void;
  commitOrderChanges: () => void;
}

export const Task: FC<ITask> = ({
  task: { id, order, title, description },
  swapTasks,
  commitOrderChanges,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragTaskData>({
    accept: Draggable.Task,
    hover(item) {
      if (item.id === id) {
        return;
      }

      const dragedTaskId = item.id;
      const hoverTaskId = id;

      if (dragedTaskId === hoverTaskId) {
        return;
      }

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
      <div ref={ref} className={classNames(isDragging ? 'bg-[#0001]' : 'bg-[#0003]')}>
        <div className={classNames('flex flex-col', isDragging && 'opacity-0')}>
          <span>title: {title}</span>
          <span>description: {description}</span>
          <span>order: {order}</span>
        </div>
      </div>
    </>
  );
};
