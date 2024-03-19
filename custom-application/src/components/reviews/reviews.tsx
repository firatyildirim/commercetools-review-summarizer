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
import DataTable from '@commercetools-uikit/data-table';
import { TQuery } from '../../types/generated/ctp';
import ReviewDetails from '../review-details';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';

const columns = [
  { key: 'product_name', label: 'Product Name' },
  { key: 'createdAt', label: 'Review Generation Date', isSortable: true },
  { key: 'lastModifiedAt', label: 'State', isSortable: true },
];

type TReviewProps = {
  linkToWelcome: string;
};

const Reviews = (props: TReviewProps) => {
  const intl = useIntl();

  const match = useRouteMatch();
  const { push } = useHistory();

  useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const { page, perPage } = usePaginationState();

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const { customObjectsPaginatedResult, error, loading } = useCustomObjectsFetcher({
    container: 'reviews-container',
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

      {customObjectsPaginatedResult ? (
        <Spacings.Stack scale="l">
          {
          // JSON.stringify(customObjectsPaginatedResult)
          }
          <DataTable<NonNullable<TQuery['customObjects']['results']>[0]>
            isCondensed
            columns={columns}
            rows={customObjectsPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'product_name':
                  return item.value;
                case 'createdAt':
                  return item.createdAt;
                case 'state':
                  return item.key;
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />
        </Spacings.Stack>
      ) : null}
      <Switch>
        <SuspendedRoute path={`${match.url}/:id`}>
          <ReviewDetails onClose={() => push(`${match.url}`)} />
        </SuspendedRoute>
      </Switch>
    </Spacings.Stack>
  );
};

Reviews.displayName = 'Reviews';

export default Reviews;
