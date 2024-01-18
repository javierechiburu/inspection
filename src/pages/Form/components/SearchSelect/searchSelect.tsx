/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FieldProps, InspectionConfigOption } from '../../types';
import { useCallback, useEffect, useState } from 'react';
import { useAxios } from 'library/api';
import Autocomplete from 'ui/autocomplete';
import { checkQuery, getParams, getUrl } from '../../helpers';
import { useWatch } from 'react-hook-form';

const SearchSelect = ({ control, field, disabled, setValue, ...props }: FieldProps) => {
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
      .then((res) => setOptions(res.data.data))
      .finally(() => setLoading(false));
  }, [api, field, query]);

  useEffect(() => {
    if (checkQuery(query)) {
      fetchData();
    }
  }, [fetchData, query]);

  return (
    <Autocomplete
      block
      {...props}
      options={options}
      disabled={loading || disabled || options.length < 1}
    />
  );
};

export default SearchSelect;
