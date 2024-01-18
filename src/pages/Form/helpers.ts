/* eslint-disable @typescript-eslint/no-explicit-any */
import { InspectionConfigField } from './types';

export const getParams = ({ optionParams }: InspectionConfigField) => {
  return optionParams
    ? optionParams?.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.id || cur.key]: cur.value,
        };
      }, {})
    : {};
};

export const getUrl = ({ optionsVia }: InspectionConfigField, query: Record<string, any>) => {
  if (optionsVia) {
    return `${optionsVia.substring(1)}?${new URLSearchParams(query).toString()}`;
  }
  return '';
};

export const checkQuery = (query: Record<string, any>) => {
  return Object.values(query).every((value) => value && value !== '');
};
