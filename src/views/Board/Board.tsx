import axios from 'axios';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../components/Spinner';
import { APIBoardData } from '../../interfaces';
import { Columns } from './components/Columns';

export const Board: FC = () => {
  const params = useParams();

  const currentBoardEndpoint = `boards/${params['boardId']}`;

  const { data: boardData, isLoading } = useQuery<APIBoardData>(currentBoardEndpoint, () =>
    axios.get(currentBoardEndpoint).then((response) => response.data)
  );

  return (
    <>
      {isLoading || !boardData ? (
        <div className="flex justify-center items-center h-full">
          <Spinner style={{ width: '5rem', height: '5rem' }} />
        </div>
      ) : (
        <div className="flex flex-col grow h-full overflow-hidden">
          <span>{boardData.title}</span>
          <Columns columns={boardData.columns} boardId={params['boardId'] || ''} />
        </div>
      )}
    </>
  );
};
