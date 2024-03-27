import DataTable from '@commercetools-uikit/data-table';

import { TLocalizedString } from '@commercetools-test-data/commons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useIntl } from 'react-intl';
import messages from './messages';

type TReviewsOnLocaleProps = {
  reviewsOnLocale: Array<TLocalizedString>
};

const columns = [
  { key: 'locale', label: 'Locale' },
  { key: 'review', label: 'Review' },
];

const ReviewsOnLocale = (props: TReviewsOnLocaleProps) => {
  const intl = useIntl();
  const { reviewsOnLocale } = props;
  const rows = Object.entries(reviewsOnLocale).map(([locale, review]) => ({
    id: locale,
    locale: locale,
    review: review
  }));

  return (
    <Spacings.Stack scale='m'>
      <Text.Headline as="h2">{intl.formatMessage(messages.summarizedReviews)}</Text.Headline>
      <DataTable rows={rows} columns={columns}/>
    </Spacings.Stack>
  );
};

ReviewsOnLocale.displayName = 'Reviews on locale';

export default ReviewsOnLocale;