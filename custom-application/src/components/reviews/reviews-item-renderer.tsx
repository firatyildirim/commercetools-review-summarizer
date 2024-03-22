import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Text from '@commercetools-uikit/text';
import { TReviewCustomObject } from '../../types/review';
import { useProductDetailsFetcher } from '../../hooks/use-product-connector/use-products-connector';
import { TColumn } from '@commercetools-uikit/data-table';
import { formatLocalizedString, transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const ItemRenderer = (item: TReviewCustomObject, column: TColumn<TReviewCustomObject>) => {

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const { product, error, loading } = useProductDetailsFetcher({ id: item.value.productId })
  
  switch (column.key) {
    case 'productName':
      
      if (error) {
        return (NO_VALUE_FALLBACK);
      }

      if (loading) {
        return (<LoadingSpinner />)
      }

      return formatLocalizedString(
        {
          name: transformLocalizedFieldToLocalizedString(
            product?.masterData?.current?.nameAllLocales ?? []
          ),
        },
        {
          key: 'name',
          locale: dataLocale,
          fallbackOrder: projectLanguages,
          fallback: NO_VALUE_FALLBACK,
        }
      );
    default:
      return null;;
    case 'lastModifiedAt':
      return item.lastModifiedAt;
    case 'state':
      return item.value?.isConfirmed ?
        <Text.Detail tone='positive'>Confirmed</Text.Detail> :
        <Text.Detail tone='negative'>Not Confirmed</Text.Detail>;
  }
};

export default ItemRenderer;
