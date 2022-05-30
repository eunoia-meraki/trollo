import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Welcome: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center grow justify-center">
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-24">
        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">{t('welcomePage.team')}</h2>
          <p className="w-64">{t('welcomePage.aboutTeam')}</p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">{t('welcomePage.project')}</h2>
          <p className="w-64">{t('welcomePage.aboutProject')}</p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">{t('welcomePage.course')}</h2>
          <p className="w-64">{t('welcomePage.aboutCourse')}</p>
        </div>
      </div>
    </div>
  );
};
