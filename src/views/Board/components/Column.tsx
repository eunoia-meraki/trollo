import axios from 'axios';
import { FC, useContext, useRef } from 'react';
import { Task } from './Task';
import { useMutation, useQueryClient } from 'react-query';
import { APIAddTaskPayload, APIColumnData } from '../../../interfaces';
import { AuthContext } from '../../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';

export interface IColumn {
  boardId: string;
  column: APIColumnData;
  swapItems: (dragColumnId: string, hoverColumnId: string) => void;
  changeOrder: () => void;
}

interface DragItem {
  columnId: string;
}

export const Column: FC<IColumn> = ({
  column: { id, order, tasks, title },
  boardId,
  swapItems,
  changeOrder,
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

  const [, drop] = useDrop<DragItem>({
    accept: 'COLUMN',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragedColumnId = item.columnId;
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
      return { columnId: id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={classNames(isDragging ? 'bg-[#0001]' : 'bg-[#0003]')}
      style={{ order }}
    >
      <div className={classNames('flex p-1 gap-1 flex-col', isDragging && 'opacity-0')}>
        <span>title: {title}</span>
        <span>order: {order}</span>
        {/* {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))} */}
        <button className="bg-[#aaa] p-1 rounded-sm" onClick={onAddTaskClick}>
          {t('addTask')}
        </button>
      </div>
    </div>
  );
};
