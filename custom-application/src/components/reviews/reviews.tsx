import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-object-connector';
import { getErrorMessage } from '../../helpers';
import FlatButton from '@commercetools-uikit/flat-button';
import { Link as RouterLink, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { BackIcon } from '@commercetools-uikit/icons';
import messages from './messages';
import Constraints from '@commercetools-uikit/constraints';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useDataTableSortingState, usePaginationState } from '@commercetools-uikit/hooks';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import ReviewDetails from '../review-details';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { TReviewCustomObject, TReviewsProps } from '../../types/review';
import { Pagination } from '@commercetools-uikit/pagination';
import ItemRenderer from './reviews-item-renderer';

const CONTAINER = 'reviews-container';

const columns: Array<TColumn> = [
  { key: 'productName', label: 'Product Name' },
  { key: 'lastModifiedAt', label: 'Review Generation Date', isSortable: true },
  { key: 'state', label: 'State' },
];

const Reviews = (props: TReviewsProps) => {

  useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const { customObjects: reviews, error, loading } = useCustomObjectsFetcher({
    container: CONTAINER,
    page,
    perPage,
    tableSorting,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>

      <Constraints.Horizontal max={'auto'}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {reviews ? (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<TReviewCustomObject[]>[0]>
            isCondensed
            columns={columns}
            rows={(reviews['results'] as TReviewCustomObject[])}
            itemRenderer={ItemRenderer}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />

          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={reviews.total}
          />

          <Switch>
            <SuspendedRoute path={`${match.url}/:id`}>
              <ReviewDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};

Reviews.displayName = 'Reviews';

export default Reviews;
