import Text from '@commercetools-uikit/text';
import { CustomFormModalPage } from '@commercetools-frontend/application-components';
import { useCustomObjectDetailsFetcher, useCustomObjectCreaterOrDeleter } from '../../hooks/use-custom-object-connector/use-custom-objects-connector';
import { useParams } from 'react-router';
import { TReviewCustomObject } from '../../types/review';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import ProductDetails from './product-details';
import Spacings from '@commercetools-uikit/spacings';
import { useState } from 'react';
import ReviewsOnLocale from './review-on-locale';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useShowApiErrorNotification, useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import { TCustomObjectDraft } from '../../types/generated/ctp';

type TReviewDetailsProps = {
  onClose: () => void;
};

const ReviewDetails = (props: TReviewDetailsProps) => {
  const [productName, setProductName] = useState('');

  const intl = useIntl();
  const { id } = useParams<{ id: string }>();
  const { customObject, loading, error } = useCustomObjectDetailsFetcher({ id});
  const { execute } = useCustomObjectCreaterOrDeleter();
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();

  const review = (customObject as TReviewCustomObject);

  const saveReview = async (review: TCustomObjectDraft) => {
    try {
      await execute({ draft: review });

      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.reviewUpdated),
      });
    } catch(error) {
      showApiErrorNotification({
        errors: [{message: intl.formatMessage(messages.apiErrorMessage), code: '400'}]
      });
    }
  }

  const confirmReview = async () => {
    const draft: TCustomObjectDraft = {
      container: review.container,
      key: review.key,
      value: JSON.stringify({
        isConfirmed: true,
        productId: review.value.productId,
        summaryOfReview: review.value.summaryOfReview,
        reviewCount: review.value.reviewCount
      })
    };

    await saveReview(draft);
  }

  const rejectReview = async () => {
    const draft: TCustomObjectDraft = {
      container: review.container,
      key: review.key,
      value: JSON.stringify({
        isConfirmed: false,
        productId: review.value.productId,
        summaryOfReview: review.value.summaryOfReview,
        reviewCount: review.value.reviewCount
      })
    };

    await saveReview(draft);
  }
  
  return (
    <CustomFormModalPage
      title={productName}
      isOpen
      onClose={props.onClose}
      formControls={
        <>
          <CustomFormModalPage.FormSecondaryButton
            isDisabled={review?.value?.isConfirmed === false}
            label={intl.formatMessage(messages.reject)}
            onClick={rejectReview}
          />
          <CustomFormModalPage.FormPrimaryButton
            isDisabled={review?.value?.isConfirmed === true}
            label={intl.formatMessage(messages.confirm)}
            onClick={confirmReview}
          />
        </>
      }
    >
      {error &&
        <ContentNotification type="error">
          <Text.Body>{getErrorMessage(error)}</Text.Body>
        </ContentNotification>
      }
      {loading && <LoadingSpinner />}
      {review ?
        <Spacings.Stack scale="l">
          <ProductDetails id={review?.value?.productId} setProductName={setProductName}/>
          <ReviewsOnLocale reviewsOnLocale={review?.value?.summaryOfReview} />
        </Spacings.Stack>
      : null}
    </CustomFormModalPage>
  );
};

ReviewDetails.displayName = 'Review Details';

export default ReviewDetails;