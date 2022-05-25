import type { FC } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

export const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      <div className="flex flex-col justify-center items-center gap-2"></div>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>{t('refresh')}</button>
    </div>
  );
};
