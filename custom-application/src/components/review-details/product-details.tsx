import Text from '@commercetools-uikit/text';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import { useProductDetailsFetcher } from '../../hooks/use-product-connector/use-products-connector';
import Constraints from '@commercetools-uikit/constraints';
import { ChainIcon, DotIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { LocalizedField } from '@commercetools-frontend/l10n/dist/declarations/src/types';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import messages from './messages';
import { SyntheticEvent, useEffect } from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import noImage from '../../no-image.svg'

type TProductDetailsProps = {
  id: string;
  setProductName(productName: string): void;
};

const ProductDetails = (props: TProductDetailsProps) => {
  const { id, setProductName } = props;


  const intl = useIntl();
  const { dataLocale, projectLanguages, projectKey } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
    projectKey: context.project?.key
  }));

  const { product, loading, error } = useProductDetailsFetcher({ id });

  const getFallbackProductImage = (e: SyntheticEvent<HTMLImageElement, Event>): void  => {
    e.currentTarget.src = noImage
  }

  useEffect(() => {
    const getFormattedLocalizedString = (localizedField: LocalizedField[]) => formatLocalizedString(
      {
        name: transformLocalizedFieldToLocalizedString(localizedField),
      },
      {
        key: 'name',
        locale: dataLocale,
        fallbackOrder: projectLanguages,
        fallback: NO_VALUE_FALLBACK,
      }
    );

    setProductName(getFormattedLocalizedString(product?.masterData?.current?.nameAllLocales || []))
  }, [dataLocale, product, projectLanguages, setProductName]); 

  return (
    <div>
      {error && (
        <ContentNotification type="error">
          <Text.Body>{getErrorMessage(error)}</Text.Body>
        </ContentNotification>
      )}
      {loading && <LoadingSpinner />}
      {product && (
        <Spacings.Stack scale='m'>
          <Spacings.Stack scale='s' alignItems='flex-start' >
            <Text.Headline as="h2">{intl.formatMessage(messages.productInformation)}</Text.Headline>
            <FlatButton
              as={Link}
              to={`/${projectKey}/products/${product?.id}`}
              label={intl.formatMessage(messages.goToProduct)}
              icon={<ChainIcon />}
            />
          </Spacings.Stack>
          <Spacings.Inline scale='l'>
            <Constraints.Horizontal max={4}>
              <img
                src={product?.masterData?.current?.masterVariant?.images?.[0]?.url || noImage}
                onError={getFallbackProductImage}
                width={'100%'}
                height={'auto'}
                alt={product?.masterData?.current?.masterVariant?.images?.[0]?.label || NO_VALUE_FALLBACK}
              />
            </Constraints.Horizontal>
            <Constraints.Horizontal max={'scale'}>
              <Spacings.Stack scale='l'>
                <Spacings.Stack scale='xs'>
                  <Text.Subheadline as='h4' isBold={true}>{intl.formatMessage(messages.description)}</Text.Subheadline>
                  <Text.Body>{product?.masterData?.current?.description || NO_VALUE_FALLBACK}</Text.Body>
                </Spacings.Stack>
                <Spacings.Stack scale='xs'>
                  <Text.Subheadline as='h4' isBold={true}>{intl.formatMessage(messages.skus)}</Text.Subheadline>
                  {product.skus.map((sku, i) =>(
                    <Spacings.Inline key={i} scale='s' alignItems='center'>
                      <DotIcon size='small' color='neutral60'/><Text.Body>{sku}</Text.Body>
                    </Spacings.Inline>
                  ))}
                </Spacings.Stack>
              </Spacings.Stack>
            </Constraints.Horizontal>
          </Spacings.Inline>
        </Spacings.Stack>
      )}
    </div>
  );
};

ProductDetails.displayName = 'Product Details';

export default ProductDetails;
