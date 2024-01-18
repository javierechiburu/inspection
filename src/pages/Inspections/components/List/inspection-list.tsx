import Pagination from 'ui/pagination';
import Accordion from 'ui/accordion';
import Item from '../Item';
import type { PaginatedInspections, FilterValues } from '../../types';
import styles from './inspection-list.module.css';
import Filters from '../Filters';
import { useState, useEffect } from 'react';
import ModalProvider from '../../contexts/modalContext';
import { useApi } from 'library/api';
import useAlerts from '../../hooks/useAlert';
import Alert from 'ui/alert';

const List = () => {
  const [inspectionList, setInspectionList] = useState<PaginatedInspections>({
    docs: [],
    total: 5,
    current: 1,
    pages: 2,
    limit: 5,
  });
  const [filters, setFilters] = useState<FilterValues>({});
  const { alert } = useAlerts();
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters({ ...filters, page });
    if (pageSize) {
      setInspectionList((prevState) => ({
        ...prevState,
        limit: pageSize,
      }));
    }
  };

  const { data } = useApi<PaginatedInspections>(
    'bff/inspections',
    'get',
    {
      ...filters,
      company: 'OLX',
      limit: inspectionList.limit,
      page: filters.page || 1,
    },
    filters
  );
  useEffect(() => {
    if (data && data.docs) {
      setInspectionList(data);
    }
  }, [data]);

  return (
    <>
      {alert.show && <Alert children={alert.message} type={alert.type} className={styles.alert} />}
      <Accordion className={styles['mobile-filters']} title="Filtros">
        <Filters onFilterChange={handleFilterChange} />
      </Accordion>
      <div className={styles['desktop-filters']}>
        <Filters onFilterChange={handleFilterChange} />
      </div>
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          {inspectionList.docs.map((entry) => (
            <ModalProvider key={entry.id}>
              <Item data={entry} key={entry.id} />
            </ModalProvider>
          ))}
        </ul>
        <Pagination
          current={inspectionList.current}
          entry="inspecciones"
          pages={inspectionList.pages}
          pageSize={inspectionList.limit}
          showTotal
          showPageSize
          total={inspectionList.total}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default List;
