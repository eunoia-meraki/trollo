import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { APIAddColumnPayload, APIColumnData, APITaskData } from '../../../interfaces';
import { Column } from './Column';

export interface IColumns {
  columns: APIColumnData[];
  boardId: string;
}

export const Columns: FC<IColumns> = ({ columns, boardId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const columnsEndpoint = `boards/${boardId}/columns`;
  const currentBoardEndpoint = `boards/${boardId}`;

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
    if (dragTaskId === hoverTaskId) {
      return;
    }

    let dragTaskColumnId = '-';
    let dragTaskOrder = 0;
    let hoverTaskColumnId = '-';
    let hoverTaskOrder = 0;

    columnsLocal.forEach((column) =>
      column.tasks.forEach((task) => {
        if (task.id === dragTaskId) {
          dragTaskColumnId = column.id;
          dragTaskOrder = task.order;
        } else if (task.id === hoverTaskId) {
          hoverTaskColumnId = column.id;
          hoverTaskOrder = task.order;
        }
      })
    );

    // avoid the different column id swap
    if (dragTaskColumnId !== hoverTaskColumnId) {
      return;
    }

    console.log('swapTasks');

    setColumnsLocal((prev) => {
      return prev.map((column) => {
        if (column.id !== dragTaskColumnId) {
          return column;
        }

        return {
          ...column,
          tasks: column.tasks.map((task) => {
            if (task.id === dragTaskId) {
              return { ...task, order: hoverTaskOrder };
            } else if (task.id === hoverTaskId) {
              return { ...task, order: dragTaskOrder };
            }
            return task;
          }),
        };
      });
    });
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

    console.log('moveTask', 'dragTaskColumnId', dragTaskColumnId, 'toColumnId', toColumnId);

    setColumnsLocal((prev) => {
      return prev.map((column) => {
        if (column.id === dragTaskColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => {
              if (task.id !== dragTaskId && task.order > dragTask.order) {
                task.order -= 1;
              }
              return task.id !== dragTaskId;
            }),
          };
        } else if (column.id === toColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, { ...dragTask, order: column.tasks.length }],
          };
        }
        return column;
      });
    });
  };

  const changeOrder = () => {
    // TODO avoid no changes case
    // TODO handle different types drop
    console.log('push columns to backend');
  };

  const addColumnMutation = useMutation<unknown, unknown, APIAddColumnPayload>(
    ({ title, order }) =>
      axios.post(columnsEndpoint, {
        title,
        order,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([currentBoardEndpoint]);
      },
      // TODO: toaster
      onError: (error) => console.log(error),
    }
  );

  const onAddColumnClick = () => {
    addColumnMutation.mutate({ title: 'column name', order: columns.length });
  };

  return (
    <div className="flex gap-2 grow overflow-hidden overflow-x-auto">
      {columns.length > 0 && (
        <div className="grid grid-rows-1 grid-flow-col gap-2">
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
      )}

      <button className="shrink-0 self-start p-2 bg-[#aaa] rounded-sm" onClick={onAddColumnClick}>
        {t('addColumn')}
      </button>
    </div>
  );
};
