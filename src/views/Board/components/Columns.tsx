import axios from 'axios';

import { FC, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

import { PlusIcon } from '@heroicons/react/solid';

import { AddItemModalContext } from '../../../components/AddItemModalProvider';
import { APIAddColumnPayload, APIColumnData, APIError, APITaskData } from '../../../interfaces';
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
    let dragColumnOrder: number | null = null;
    let hoverColumnOrder: number | null = null;

    columnsLocal.find((column) => {
      if (column.id === dragColumnId) {
        dragColumnOrder = column.order;
      }

      if (column.id === hoverColumnId) {
        hoverColumnOrder = column.order;
      }

      return dragColumnOrder !== null && hoverColumnOrder !== null;
    });

    if (dragColumnOrder === null || hoverColumnOrder === null) {
      return;
    }

    console.log('swap');

    setColumnsLocal((prev) =>
      prev.map((column) => {
        // allways false... escape warnings...
        if (dragColumnOrder === null || hoverColumnOrder === null) {
          return { ...column };
        }

        if (column.id === dragColumnId) {
          return { ...column, order: hoverColumnOrder };
        }

        const dir = dragColumnOrder - hoverColumnOrder;

        return dir > 0
          ? {
              ...column,
              order:
                column.order >= hoverColumnOrder && column.order < dragColumnOrder
                  ? column.order + 1
                  : column.order,
            }
          : {
              ...column,
              order:
                column.order <= hoverColumnOrder && column.order > dragColumnOrder
                  ? column.order - 1
                  : column.order,
            };
      })
    );
  };

  const swapTasks = (dragTaskId: string, hoverTaskId: string) => {
    if (dragTaskId === hoverTaskId) {
      return;
    }

    let dragTaskColumnId: string | null = null;
    let dragTaskOrder: number | null = null;
    let hoverTaskColumnId: string | null = null;
    let hoverTaskOrder: number | null = null;

    columnsLocal.find((column) =>
      column.tasks.find((task) => {
        if (task.id === dragTaskId) {
          dragTaskColumnId = column.id;
          dragTaskOrder = task.order;
        } else if (task.id === hoverTaskId) {
          hoverTaskColumnId = column.id;
          hoverTaskOrder = task.order;
        }

        return (
          dragTaskColumnId !== null &&
          dragTaskOrder !== null &&
          hoverTaskColumnId !== null &&
          hoverTaskOrder !== null
        );
      })
    );

    if (
      // avoid swap between different columns
      dragTaskColumnId !== hoverTaskColumnId ||
      dragTaskColumnId === null ||
      dragTaskOrder === null ||
      hoverTaskColumnId === null ||
      hoverTaskOrder === null
    ) {
      return;
    }

    console.log('swapTasks');

    setColumnsLocal((prev) => {
      return prev.map((column) =>
        column.id !== dragTaskColumnId
          ? { ...column }
          : {
              ...column,
              tasks: column.tasks.map((task) => {
                // allways false... escape warnings...
                if (
                  dragTaskColumnId === null ||
                  dragTaskOrder === null ||
                  hoverTaskColumnId === null ||
                  hoverTaskOrder === null
                ) {
                  return { ...task };
                }

                if (task.id === dragTaskId) {
                  return { ...task, order: hoverTaskOrder };
                }

                const dir = dragTaskOrder - hoverTaskOrder;

                return dir > 0
                  ? {
                      ...task,
                      order:
                        task.order >= hoverTaskOrder && task.order < dragTaskOrder
                          ? task.order + 1
                          : task.order,
                    }
                  : {
                      ...task,
                      order:
                        task.order <= hoverTaskOrder && task.order > dragTaskOrder
                          ? task.order - 1
                          : task.order,
                    };
              }),
            }
      );
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
        }

        return task.id === dragTaskId;
      })
    );

    // avoid the same column id move
    if (dragTaskColumnId === toColumnId) {
      return;
    }

    console.log('moveTask', 'dragTaskColumnId', dragTaskColumnId, 'toColumnId', toColumnId);

    setColumnsLocal((prev) =>
      prev.map((column) => {
        if (column.id === dragTaskColumnId) {
          return {
            ...column,
            tasks: column.tasks.reduce<APITaskData[]>((acc, task) => {
              return [
                ...acc,
                ...(task.id !== dragTaskId
                  ? [
                      {
                        ...task,
                        order: task.order > dragTask.order ? task.order - 1 : task.order,
                      },
                    ]
                  : []),
              ];
            }, []),
          };
        } else if (
          column.id === toColumnId &&
          column.tasks.find((t) => t.id === dragTask.id) === undefined
        ) {
          return {
            ...column,
            tasks: [...column.tasks, { ...dragTask, order: column.tasks.length }],
          };
        }

        return { ...column };
      })
    );
  };

  const changeOrder = () => {
    // TODO avoid no changes case
    // TODO handle different types drop
    console.log('push columns to backend');
  };

  const addColumnMutation = useMutation<unknown, APIError, APIAddColumnPayload>(
    ({ title, order }) =>
      axios.post(columnsEndpoint, {
        title,
        order,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([currentBoardEndpoint]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const { openModal } = useContext(AddItemModalContext);

  const addColumn = (title: string): void => {
    addColumnMutation.mutate({
      title: title,
      order: columns.length,
    });
  };

  const onAddColumnButtonClick = () => {
    openModal(t('addColumn'), addColumn);
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

      <button
        className={`shrink-0 self-start p-2 flex gap-1 py-2.5 pr-5 text-sm font-medium text-gray-900
           focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100
          hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200`}
        onClick={onAddColumnButtonClick}
      >
        <PlusIcon className="w-5 h-5" />
        {t('addColumn')}
      </button>
    </div>
  );
};
