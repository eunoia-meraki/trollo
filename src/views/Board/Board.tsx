import axios from 'axios';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import type { APIBoardData, APIError } from '../../interfaces';
import { Columns } from './components/Columns';

export const Board: FC = () => {
  const params = useParams();

  const currentBoardEndpoint = `boards/${params['boardId']}`;

  const { data: boardData } = useQuery<APIBoardData, APIError>(
    currentBoardEndpoint,
    () => axios.get(currentBoardEndpoint).then((response) => response.data),
    {
      onError: (e) => {
        toast.error(e.message);
      },
      select: (nonSortedData) => {
        const data = {
          ...nonSortedData,
          columns: [
            ...nonSortedData.columns.map((column) => ({
              ...column,
              tasks: [...column.tasks].sort((t1, t2) => t1.order - t2.order),
            })),
          ].sort((c1, c2) => c1.order - c2.order),
        };
        return data;
      },
    }
  );

  return (
    <div className="container flex flex-col mx-auto my-2 p-2 h-full bg-white border overflow-hidden min-h-[300px]">
      {boardData && (
        <div className="flex flex-col grow gap-2 h-full overflow-hidden">
          <div className="rounded-sm text-lg">
            <span className="font-semibold">{boardData.title}</span>
          </div>
          <Columns boardData={boardData} boardId={params['boardId'] || ''} />
        </div>
      )}
    </div>
  );
};
