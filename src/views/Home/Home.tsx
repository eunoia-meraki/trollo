import axios from 'axios';

import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import _ from 'lodash';

import type { APIBoardsData, APIError } from '../../interfaces';
import { AddBoardBar } from './AddBoardBar';
import { RemoveBoardButton } from './RemoveBoardButton';
import { Path } from '../../types';

export const Home: FC = () => {
  const { data: boards } = useQuery<APIBoardsData, APIError>(
    'boards',
    () => axios.get('boards').then((response) => response.data),
    {
      onError: (e) => {
        toast.error(e.message);
      },
    }
  );

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container flex flex-col mx-auto my-2 p-2 h-full bg-white border overflow-y-scroll min-h-[300px]">
      <h1 className="text-xl px-2">{t('boards')}</h1>

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
    </div>
  );
};
