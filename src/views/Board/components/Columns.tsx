import axios from 'axios';

import { FC, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

import { PlusIcon } from '@heroicons/react/solid';

import { AddItemModalContext } from '../../../components/AddItemModalProvider';
import {
  APIAddColumnPayload,
  APIBoardData,
  APIColumnData,
  APIError,
  APIEditColumnPayload,
  APIUsersData,
  APIEditColumnResponse,
  APIEditTaskResponse,
  APIEditTaskPayload,
  APITaskData,
} from '../../../interfaces';
import { Column } from './Column';

export interface IColumns {
  boardData: APIBoardData;
  boardId: string;
}

export const Columns: FC<IColumns> = ({ boardData, boardId }) => {
  const { columns } = boardData;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const columnsEndpoint = `boards/${boardId}/columns`;
  const currentBoardEndpoint = `boards/${boardId}`;

  const { data: usersData } = useQuery<APIUsersData, APIError>(
    'users',
    () => axios.get('users').then((response) => response.data),
    {
      onError: (e) => {
        toast.error(e.message);
      },
    }
  );

  const [columnsLocal, setColumnsLocal] = useState<{ [id: string]: APIColumnData }>({});

  useEffect(() => {
    setColumnsLocal(
      columns.reduce<{ [id: string]: APIColumnData }>((obj, item) => {
        return {
          ...obj,
          [item.id]: item,
        };
      }, {})
    );
  }, [columns]);

  const modifyColumnMutation = useMutation<
    APIEditColumnResponse,
    APIError,
    APIEditColumnPayload,
    APIBoardData
  >(
    ({ title, order, id }) =>
      axios.put(`${columnsEndpoint}/${id}`, {
        title,
        order,
      }),
    {
      onMutate: async (editedColumn) => {
        const previousBoardData = queryClient.getQueryData<APIBoardData>(currentBoardEndpoint);

        queryClient.setQueryData<APIBoardData | undefined>(currentBoardEndpoint, (prev) => {
          if (!prev) {
            return;
          }

          const columnBeforeEdit = prev.columns.find((column) => editedColumn.id == column.id);

          if (!columnBeforeEdit) {
            return prev;
          }

          const dragColumnId = editedColumn.id;
          const dragColumnOrder = columnBeforeEdit.order;
          const hoverColumnOrder = editedColumn.order;

          return {
            ...prev,
            columns: prev.columns.map((column) => {
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
            }),
          };
        });

        return previousBoardData;
      },
      onError: (error, payload, previousBoardData) => {
        toast.error(error.message);
        queryClient.setQueryData(currentBoardEndpoint, previousBoardData);
      },
    }
  );

  const modifyTaskMutation = useMutation<
    APIEditTaskResponse,
    APIError,
    APIEditTaskPayload,
    APIBoardData
  >(
    ({ id, title, description, order, userId, selfColumnId, columnId, boardId }) =>
      axios.put(`boards/${boardId}/columns/${selfColumnId}/tasks/${id}`, {
        title,
        description,
        order,
        userId,
        boardId,
        columnId,
      }),
    {
      onMutate: async (editedTask) => {
        const previousBoardData = queryClient.getQueryData<APIBoardData>(currentBoardEndpoint);

        queryClient.setQueryData<APIBoardData | undefined>(currentBoardEndpoint, (prev) => {
          if (!prev) {
            return;
          }

          const taskBeforeEdit = prev.columns
            .find((column) => column.id === editedTask.selfColumnId)
            ?.tasks.find((task) => task.id === editedTask.id);

          if (!taskBeforeEdit) {
            return prev;
          }

          const dragTaskId = taskBeforeEdit.id;
          const dragTaskOrder = taskBeforeEdit.order;
          const dragTaskColumnId = editedTask.selfColumnId;

          const hoverTaskOrder = editedTask.order;
          const hoverTaskColumnId = editedTask.columnId;

          return {
            ...prev,
            columns:
              dragTaskColumnId === hoverTaskColumnId
                ? prev.columns.map((column) =>
                    column.id !== hoverTaskColumnId
                      ? { ...column }
                      : {
                          ...column,
                          tasks: column.tasks.map((task) => {
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
                  )
                : prev.columns.map((column) => {
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
                                    order: task.order > dragTaskOrder ? task.order - 1 : task.order,
                                  },
                                ]
                              : []),
                          ];
                        }, []),
                      };
                    } else if (column.id === hoverTaskColumnId) {
                      return {
                        ...column,
                        tasks: [
                          ...column.tasks.map((task) =>
                            task.order >= hoverTaskOrder ? { ...task, order: task.order + 1 } : task
                          ),
                          { ...taskBeforeEdit, order: hoverTaskOrder },
                        ],
                      };
                    }

                    return { ...column };
                  }),
          };
        });

        return previousBoardData;
      },
      onError: (error, payload, previousBoardData) => {
        toast.error(error.message);
        queryClient.setQueryData(currentBoardEndpoint, previousBoardData);
      },
    }
  );

  const onBoardDragEnd = (source: DraggableLocation, destination: DraggableLocation) => {
    if (source.index == destination.index) {
      return;
    }
    const copiedColumns = Object.values(columnsLocal);

    modifyColumnMutation.mutate({
      id: copiedColumns[source.index].id,
      order: copiedColumns[destination.index].order,
      title: copiedColumns[source.index].title,
    });
  };

  const onColumnDragEnd = (source: DraggableLocation, destination: DraggableLocation) => {
    const srcColumnTasks = columnsLocal[source.droppableId].tasks;
    const dstColumnTasks = columnsLocal[destination.droppableId].tasks;
    const editedTask = srcColumnTasks[source.index];

    const sameColumn = source.droppableId === destination.droppableId;

    const dstTask = dstColumnTasks[destination.index];
    const moveOrder = !dstTask ? destination.index + 1 : dstColumnTasks[destination.index].order;

    modifyTaskMutation.mutate({
      ...editedTask,
      boardId,
      order: sameColumn ? srcColumnTasks[destination.index].order : moveOrder,
      columnId: sameColumn ? source.droppableId : destination.droppableId,
      selfColumnId: source.droppableId,
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (result.type == 'BOARD') {
      onBoardDragEnd(source, destination);
      return;
    } else {
      onColumnDragEnd(source, destination);
    }
  };

  const addColumnMutation = useMutation<unknown, APIError, APIAddColumnPayload>(
    ({ title }) =>
      axios.post(columnsEndpoint, {
        title,
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
      title,
    });
  };

  const onAddColumnButtonClick = () => {
    openModal('column', addColumn);
  };

  return (
    <div className="flex gap-2 grow overflow-hidden overflow-x-auto">
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        {Object.entries(columnsLocal).length > 0 && (
          <Droppable droppableId={'board'} type="BOARD" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-rows-1 grid-flow-col gap-2"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Object.entries(columnsLocal).map(([, column], index) => (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(provided) => (
                      <Column
                        column={column}
                        boardId={boardId}
                        usersData={usersData}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </DragDropContext>

      <button
        className={`shrink-0 self-start p-2 flex gap-1 py-2.5 pr-5 text-sm font-medium text-gray-900
         focus:outline-none bg-white rounded-lg border border-gray-200 focus:border-gray-400 hover:bg-gray-100
       hover:text-blue-700 focus:z-10`}
        onClick={onAddColumnButtonClick}
      >
        <PlusIcon className="w-5 h-5" />
        {t('addColumn')}
      </button>
    </div>
  );
};
