import { FC, useEffect, useState } from 'react';
import { APIColumnData } from '../../../interfaces';
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

  const swapItems = (dragColumnId: string, hoverColumnId: string) => {
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

  const changeOrder = () => {
    console.log('push columns to backend');
  };

  return (
    <div className="flex gap-2">
      {columnsLocal.map((column) => (
        <Column
          key={column.id}
          column={column}
          boardId={boardId}
          swapItems={swapItems}
          changeOrder={changeOrder}
        />
      ))}
    </div>
  );
};
