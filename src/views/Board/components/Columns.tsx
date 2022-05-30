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
    console.log(columns);
  }, [columns]);

  const modifyColumnMutation = useMutation<
    APIEditColumnResponse,
    APIError,
    APIEditColumnPayload,
    APIBoardData
  >(
    ({ title, order, columnId }) =>
      axios.put(`${columnsEndpoint}/${columnId}`, {
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
          const columnBeforeEdit = prev.columns.find(
            (column) => editedColumn.columnId == column.id
          );

          if (!columnBeforeEdit) {
            return prev;
          }

          return {
            ...prev,
            columns: prev.columns.map((column) => {
              if (column.id === columnBeforeEdit.id) {
                return { ...column, order: editedColumn.order };
              }
              const dir = columnBeforeEdit.order - editedColumn.order;
              return dir > 0
                ? {
                    ...column,
                    order:
                      column.order >= editedColumn.order && column.order < columnBeforeEdit.order
                        ? column.order + 1
                        : column.order,
                  }
                : {
                    ...column,
                    order:
                      column.order <= editedColumn.order && column.order > columnBeforeEdit.order
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

  const onBoardDragEnd = (source: DraggableLocation, destination: DraggableLocation) => {
    if (source.index == destination.index) {
      return;
    }
    const copiedColumns = [...Object.entries(columnsLocal).map(([, column]) => column)];

    modifyColumnMutation.mutate({
      columnId: copiedColumns[source.index].id,
      order: copiedColumns[destination.index].order,
      title: copiedColumns[source.index].title,
    });
  };

  const onColumnDragEnd = (source: DraggableLocation, destination: DraggableLocation) => {
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columnsLocal[source.droppableId];
      const destColumn = columnsLocal[destination.droppableId];
      let sourceItems = [...sourceColumn.tasks];
      let destItems = [...destColumn.tasks];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      sourceItems = sourceItems.map((item, index) => ({ ...item, order: index }));
      destItems = destItems.map((item, index) => ({ ...item, order: index }));

      const newColumnsLocal = {
        ...columnsLocal,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems,
        },
      };

      console.log(newColumnsLocal);
    } else {
      const column = columnsLocal[source.droppableId];
      let copiedTasks = [...column.tasks];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);

      copiedTasks = copiedTasks.map((item, index) => ({ ...item, order: index }));

      const newColumnsLocal = {
        ...columnsLocal,
        [source.droppableId]: {
          ...column,
          tasks: copiedTasks,
        },
      };

      console.log(newColumnsLocal);
    }
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
