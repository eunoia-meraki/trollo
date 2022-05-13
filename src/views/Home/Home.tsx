import axios from 'axios';
import { type FC } from 'react';
import { useQuery } from 'react-query';

export const Home: FC = () => {
  const { data } = useQuery(['boards', {}], () =>
    axios.get('boards').then((response) => response.data)
  );
  return <div>{JSON.stringify(data)}</div>;
};
