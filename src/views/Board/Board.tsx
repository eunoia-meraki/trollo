import axios from 'axios';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { APIAddColumnPayload, APIBoardData } from '../../interfaces';
import { Columns } from './components/Columns';

export const Board: FC = () => {
  const { t } = useTranslation();

  const params = useParams();
  const queryClient = useQueryClient();

  const currentBoardEndpoint = `boards/${params['boardId']}`;
  const columnsEndpoint = `boards/${params['boardId']}/columns`;

  const { data: boardData, isLoading } = useQuery<APIBoardData>(currentBoardEndpoint, () =>
    axios.get(currentBoardEndpoint).then((response) => response.data)
  );

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
    if (!boardData) {
      return;
    }
    addColumnMutation.mutate({ title: 'column name', order: boardData.columns.length });
  };

  return (
    <>
      {isLoading || !boardData ? (
        // TODO replace with full page loading spinner
        <h1>Loading...</h1>
      ) : (
        <div>
          <h1>{boardData.title}</h1>

          <div className="flex gap-1 items-start">
            <Columns columns={boardData.columns} boardId={params['boardId'] || ''} />
            <button className="bg-[#aaa] p-1 rounded-sm" onClick={onAddColumnClick}>
              {t('addColumn')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
