import { FC, useEffect, useState } from 'react';
import { APIColumnData, APITaskData } from '../../../interfaces';
import { Column } from './Column';

export interface IColumns {
  columns: APIColumnData[];
  boardId: string;
}

export const Columns: FC<IColumns> = ({ columns, boardId }) => {
  const [columnsLocal, setColumnsLocal] = useState(columns);

  useEffect(() => {
    setColumnsLocal(columns);
  }, [columns]);

  const swapColumns = (dragColumnId: string, hoverColumnId: string) => {
    setColumnsLocal((prev) => {
      const draggedOrder = prev.find((column) => column.id === dragColumnId)?.order;
      const hoverOrder = prev.find((column) => column.id === hoverColumnId)?.order;

      if (draggedOrder === undefined || hoverOrder === undefined) {
        return prev;
      }

      console.log('swap');

      return prev.map((column) => {
        const newColumn = { ...column };

        if (newColumn.id === dragColumnId) {
          newColumn.order = hoverOrder;
        }

        if (newColumn.id === hoverColumnId) {
          newColumn.order = draggedOrder;
        }

        return newColumn;
      });
    });
  };

  const swapTasks = (dragTaskId: string, hoverTaskId: string) => {
    let dragTask: APITaskData;
    let dragTaskColumnId = '-';
    let hoverTask: APITaskData;
    let hoverTaskColumnId = '-';

    columnsLocal.forEach((column) =>
      column.tasks.forEach((task) => {
        if (task.id === dragTaskId) {
          dragTask = task;
          dragTaskColumnId = column.id;
        } else if (task.id === hoverTaskId) {
          hoverTask = task;
          hoverTaskColumnId = column.id;
        }
      })
    );

    // avoid the different column id swap
    if (dragTaskColumnId !== hoverTaskColumnId) {
      return;
    }

    console.log('swapTasks');
  };

  const moveTask = (dragTaskId: string, toColumnId: string) => {
    let dragTask: APITaskData;
    let dragTaskColumnId = '-';

    columnsLocal.find((column) =>
      column.tasks.find((task) => {
        if (task.id === dragTaskId) {
          dragTask = task;
          dragTaskColumnId = column.id;
          return true;
        }
        return false;
      })
    );

    // avoid the same column id move
    if (dragTaskColumnId === toColumnId) {
      return;
    }

    console.log('moveTask');
  };

  const changeOrder = () => {
    // TODO avoid no changes case
    // TODO handle different types drop
    console.log('push columns to backend');
  };

  return (
    <div className="flex gap-2 items-start">
      {columnsLocal.map((column) => (
        <Column
          key={column.id}
          column={column}
          boardId={boardId}
          swapColumns={swapColumns}
          swapTasks={swapTasks}
          moveTask={moveTask}
          commitOrderChanges={changeOrder}
        />
      ))}
    </div>
  );
};
