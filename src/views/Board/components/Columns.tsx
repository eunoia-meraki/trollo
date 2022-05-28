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
  APIUsersData,
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

  const [columnsLocal, setColumnsLocal] = useState(
    columns.reduce<{ [id: string]: APIColumnData }>((obj, item) => {
      return {
        ...obj,
        [item.id]: item,
      };
    }, {})
  );

  useEffect(() => {
    columns.reduce<{ [id: string]: APIColumnData }>((obj, item) => {
      return {
        ...obj,
        [item.id]: item,
      };
    }, {});
  }, [columns]);

  const onBoardDragEnd = (source: DraggableLocation, destination: DraggableLocation) => {
    setColumnsLocal((columns) => {
      let copiedColumns = [...Object.entries(columns).map(([, column]) => column)];

      const [removed] = copiedColumns.splice(source.index, 1);
      copiedColumns.splice(destination.index, 0, removed);

      copiedColumns = copiedColumns.map((item, index) => ({ ...item, order: index }));

      return copiedColumns.reduce<{ [id: string]: APIColumnData }>((obj, item) => {
        return {
          ...obj,
          [item.id]: item,
        };
      }, {});
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

      setColumnsLocal((columns) => ({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems,
        },
      }));
    } else {
      const column = columnsLocal[source.droppableId];
      let copiedTasks = [...column.tasks];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);

      copiedTasks = copiedTasks.map((item, index) => ({ ...item, order: index }));

      setColumnsLocal((columns) => ({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedTasks,
        },
      }));
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
