import axios from 'axios';
import { FC, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { APIAddColumnPayload, APIAddTaskPayload, APIBoardData } from '../../interfaces';

export const Board: FC = () => {
  const params = useParams();
  const { authInfo } = useContext(AuthContext);

  const { data: boardData, isLoading } = useQuery<APIBoardData>(`boards/${params['boardId']}`, () =>
    axios.get(`boards/${params['boardId']}`).then((response) => response.data)
  );

  const queryClient = useQueryClient();

  const addColumnMutation = useMutation<unknown, unknown, APIAddColumnPayload>(
    ({ title, order }) =>
      axios.post(`boards/${params['boardId']}/columns`, {
        title,
        order,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([`boards/${params['boardId']}`]);
        console.log(data);
      },
      onError: (error) => console.log(error), // TODO: toaster
    }
  );

  const addTaskMutation = useMutation<unknown, unknown, APIAddTaskPayload & { columnId: string }>(
    ({ title, order, description, userId, columnId }) =>
      axios.post(`boards/${params['boardId']}/columns/${columnId}/tasks`, {
        title,
        order,
        description,
        userId,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([`boards/${params['boardId']}`]);
        console.log(data);
      },
      onError: (error) => console.log(error), // TODO: toaster
    }
  );

  // console.log(boardData);

  return (
    <>
      {isLoading || !boardData ? (
        <h1>Loading...</h1>
      ) : (
        <div className="">
          <h1>{boardData.title}</h1>
          <div className="flex gap-1">
            {boardData.columns.map((column) => (
              <div key={column.order} className="flex p-1 gap-1 flex-col bg-[#0001]">
                <h1>{column.title}</h1>
                {column.tasks.map((task) => (
                  <div key={task.order} className="flex bg-[#0003]">
                    <h1>{task.title}</h1>
                  </div>
                ))}
                <button
                  className="bg-[#aaa] p-1 rounded-sm"
                  onClick={() =>
                    addTaskMutation.mutate({
                      columnId: column.id,
                      title: 'task name',
                      order: column.tasks.length,
                      description: 'task desc',
                      userId: authInfo!.userId, // TODO fix
                    })
                  }
                >
                  Add task
                </button>
              </div>
            ))}
            <button
              className="bg-[#aaa] p-1 rounded-sm"
              onClick={() =>
                addColumnMutation.mutate({ title: 'column name', order: boardData.columns.length })
              }
            >
              Add column
            </button>
          </div>
        </div>
      )}
    </>
  );
};
