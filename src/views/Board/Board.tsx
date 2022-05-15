import axios from 'axios';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export const Board: FC = () => {
  const params = useParams();

  const boardQueryResult = useQuery(`boards/${params['boardId']}`, () =>
    axios.get(`boards/${params['boardId']}`)
  );
  return <p>${JSON.stringify(boardQueryResult.data?.['data'])}</p>;
};
