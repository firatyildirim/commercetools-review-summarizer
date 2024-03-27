import { TLocalizedString, TCustomObject } from './generated/ctp';

type Modify<T, R> = Omit<T, keyof R> & R;

export type TReviewCustomObject = Modify<TCustomObject, {
  value: {
    productId: string
    summaryOfReview: Array<TLocalizedString>
    isConfirmed: boolean
    reviewCount: number
  }
}>
