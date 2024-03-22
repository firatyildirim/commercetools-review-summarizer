import Text from '@commercetools-uikit/text';
import { InfoModalPage } from '@commercetools-frontend/application-components';
import { useCustomObjectDetailsFetcher } from '../../hooks/use-custom-object-connector/use-custom-objects-connector';
import { useParams } from 'react-router';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { TReviewCustomObject } from '../../types/review';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';

type TReviewDetailsProps = {
  onClose: () => void;
};

const ReviewDetails = (props: TReviewDetailsProps) => {
  const params = useParams<{ id: string }>();

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));

  const { customObject: review, loading, error } = useCustomObjectDetailsFetcher({
    id: params.id,
  });

  return (
    <InfoModalPage title="Manage your account" isOpen onClose={props.onClose}>
      {error &&
        <ContentNotification type="error">
          <Text.Body>{getErrorMessage(error)}</Text.Body>
        </ContentNotification>
      }
      {loading && <LoadingSpinner />}
      {review ?
        <Text.Body>
          {formatLocalizedString(
          {
            value: (review as TReviewCustomObject)?.value?.summaryOfReview ?? []
          },
          {
            key: 'value',
            locale: dataLocale,
            fallbackOrder: projectLanguages,
            fallback: NO_VALUE_FALLBACK,
          })}
        </Text.Body>
      : null}
    </InfoModalPage>
  );
};

ReviewDetails.displayName = 'Reviews';

export default ReviewDetails;