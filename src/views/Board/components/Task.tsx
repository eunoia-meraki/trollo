import classNames from 'classnames';
import { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { APITaskData } from '../../../interfaces';

interface DragItem {
  taskId: string;
}
export interface ITask {
  task: APITaskData;
  swapItems: (dragTaskId: string, hoverTaskId: string) => void;
  changeOrder: () => void;
}

export const Task: FC<ITask> = ({
  task: { id, order, title, description },
  changeOrder,
  swapItems,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragItem>({
    accept: 'COLUMN',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragedColumnId = item.taskId;
      const hoverColumnId = id;

      if (dragedColumnId === hoverColumnId) {
        return;
      }

      swapItems(dragedColumnId, hoverColumnId);
    },
    drop: () => changeOrder(),
  });

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'COLUMN',
    item: () => {
      return { taskId: id };
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
