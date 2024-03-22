/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type {
  TQuery,
  TQuery_ProductArgs,
  TQuery_ProductsArgs
} from '../../types/generated/ctp';
import FetchProductDetailsQuery from './fetch-product-details.ctp.graphql';
import FetchProductsQuery from './fetch-products.ctp.graphql';
import type { TDataTableSortingState } from '@commercetools-uikit/hooks';

type PaginationAndSortingProps = {
  where: string,
  skus: Array<string>,
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};
type TUseProductsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  products?: TQuery['products'];
  error?: ApolloError;
  loading: boolean;
};

export const useProductsFetcher: TUseProductsFetcher = ({
  where,
  skus,
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery<
    TQuery, // data
    TQuery_ProductsArgs
  >(FetchProductsQuery, {
    variables: {
      where,
      skus,
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    products: data?.products,
    error,
    loading,
  };
};


type TUseProductDetailsFetcher = (
  variables : TQuery_ProductArgs
) => {
  product?: TQuery['product'];
  error?: ApolloError;
  loading: boolean;
};

export const useProductDetailsFetcher: TUseProductDetailsFetcher = (
  variables: TQuery_ProductArgs
) => {
  const { data, error, loading } = useMcQuery<
    TQuery, // data
    TQuery_ProductArgs
  >(FetchProductDetailsQuery, {
    variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    product: data?.product,
    error,
    loading,
  };
};
