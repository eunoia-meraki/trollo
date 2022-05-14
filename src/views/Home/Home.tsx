import axios from 'axios';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

export const Home: FC = () => {
  const { data } = useQuery(['boards', {}], () =>
    axios.get('boards').then((response) => response.data)
  );

  const { t } = useTranslation();
  console.log(t('hello'));

  return <div>{JSON.stringify(data)}</div>;
};
