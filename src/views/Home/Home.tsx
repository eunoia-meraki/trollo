import axios from 'axios';

import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import _ from 'lodash';

import { APIBoardsData } from '../../interfaces';
import { AddBoardBar } from './AddBoardBar';
import { RemoveBoardButton } from './RemoveBoardButton';
import { Path } from '../../types';

export const Home: FC = () => {
  const { data: boards, isLoading } = useQuery<APIBoardsData>('boards', () =>
    axios.get('boards').then((response) => response.data)
  );

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container flex flex-col mx-auto my-2 p-2 h-full bg-white border overflow-y-scroll min-h-[300px]">
      <h1 className="text-xl px-2">{t('boards')}</h1>

      {isLoading && (
        <div className="flex items-center justify-center">
          <svg
            role="status"
            className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="px-2 border-b min-width-full">
            <AddBoardBar />
          </div>

          {!_.isUndefined(boards) && boards?.length > 0 && (
            <ul className="px-2 divide-y">
              {boards.map((board) => {
                return (
                  <li
                    key={board.id}
                    className="flex justify-between items-center p-4 dark:text-d-label-primary1 text-label-primary1 min-width-full transition-all"
                  >
                    <button
                      className="transition-colors hover:text-label-primary2 hover:dark:text-d-label-primary2 hover:cursor-pointer
                 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:dark:ring-d-gray-300"
                      onClick={() => navigate(Path.Board.replace(':boardId', board.id))}
                    >
                      {board.title}
                    </button>

                    <RemoveBoardButton boardId={board.id} />
                  </li>
                );
              })}
            </ul>
          )}

          {!boards?.length && (
            <div className="flex min-h-[10rem] items-center justify-center">
              <p className="text-gray-500">{`${t('dummy.NoBordsYet')}...`}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
