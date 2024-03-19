/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type {
  Maybe,
  TCustomObject,
  TQuery,
  TQuery_CustomObjectArgs,
  TQuery_CustomObjectsArgs,
} from '../../types/generated/ctp';
import FetchCustomObjectDetailsQuery from './fetch-custom-object-details.ctp.graphql';
import FetchCustomObjectsQuery from './fetch-custom-objects.ctp.graphql';
import type { TDataTableSortingState } from '@commercetools-uikit/hooks';

type PaginationAndSortingProps = {
  container: string,
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};
type TUseCustomObjectsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  customObjectsPaginatedResult?: TQuery['customObjects'];
  error?: ApolloError;
  loading: boolean;
};

export const useCustomObjectsFetcher: TUseCustomObjectsFetcher = ({
  container,
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery<
    TQuery, // data
    TQuery_CustomObjectsArgs
  >(FetchCustomObjectsQuery, {
    variables: {
      container,
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  console.log('data?', data);
  return {
    customObjectsPaginatedResult: data?.customObjects,
    error,
    loading,
  };
};


type TUseCustomObjectDetailsFetcher = ({
  container,
  key,
}: TQuery_CustomObjectArgs) => {
  customObject?: Maybe<TCustomObject>;
  error?: ApolloError;
  loading: boolean;
};

export const useCustomObjectDetailsFetcher: TUseCustomObjectDetailsFetcher = ({
  container,
  key,
}: TQuery_CustomObjectArgs) => {
  const { data, error, loading } = useMcQuery<
    { customObject: Maybe<TCustomObject> }, // data
    TQuery_CustomObjectArgs
  >(FetchCustomObjectDetailsQuery, {
    variables: {
      container,
      key,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  console.log('data?', data);
  return {
    customObject: data?.customObject,
    error,
    loading,
  };
};
