/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FieldProps, InspectionConfigOption } from '../../types';
import { useCallback, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useAxios } from 'library/api';
import { checkQuery, getParams, getUrl } from '../../helpers';
import AutoComplete from 'ui/autocomplete';

const SearchWithOther = ({ control, field, disabled, setValue, ...props }: FieldProps) => {
  const [options, setOptions] = useState<InspectionConfigOption[]>([]);
  const [query, setQuery] = useState<Record<string, any>>(getParams(field));
  const [loading, setLoading] = useState(true);
  const { api } = useAxios();
  const dependencies = useWatch({ control, name: field.dependencies || [] });

  useEffect(() => {
    if (dependencies.length > 0) {
      setQuery((prev) => {
        const newQuery = { ...prev };
        field.dependencies?.forEach((el, index) => (newQuery[el] = dependencies[index]));
        return newQuery;
      });
    }
  }, [field.dependencies, dependencies]);

  const fetchData = useCallback(() => {
    api
      .get(getUrl(field, query))
      .then((res) => setOptions([...res.data.data, { label: 'Otro', value: 'other' }]))
      .finally(() => setLoading(false));
  }, [api, field, query]);

  useEffect(() => {
    if (checkQuery(query)) {
      fetchData();
    }
  }, [fetchData, query]);

  return (
    <AutoComplete
      block
      {...props}
      options={options}
      disabled={loading || disabled || options.length < 1}
    />
  );
};

export default SearchWithOther;
