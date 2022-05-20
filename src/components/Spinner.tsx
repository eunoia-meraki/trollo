import classNames from 'classnames';
import { FC } from 'react';

export const Spinner: FC<
  Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'className'>
> = (props) => {
  return (
    <div
      {...props}
      className={classNames(
        `border-4 border-solid border-blue-600 border-b-gray-200 dark:border-d-gray-600/20 dark:border-b-d-gray-600 rounded-full inline-block box-border animate-spin`
      )}
    ></div>
  );
};
