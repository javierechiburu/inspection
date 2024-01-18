import Select from 'ui/select';
//import DateInput from 'ui/dateInput';
import TextInput from 'ui/textInput';
import styles from './filters.module.css';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useApi } from 'library/api';
import { useAuth } from 'library/authentication';

interface optionInterface {
  value: string;
  label: string;
}
interface filterOptions {
  purchaseChannel: Array<optionInterface>;
  inspectionStatus: Array<optionInterface>;
  inspectors: Array<optionInterface>;
  locations: Array<optionInterface>;
}

interface FilterValues {
  location?: string;
  inspector?: string;
  purchaseChannel?: string;
  inspectionStatus?: string;
  licensePlate?: string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const Filters = ({ onFilterChange }: FiltersProps) => {
  const [filterOptions, setFilterOptions] = useState<filterOptions>({
    purchaseChannel: [],
    inspectionStatus: [],
    inspectors: [],
    locations: [],
  });

  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({});
  const { data } = useApi<filterOptions>('bff/filters?company=OLX', 'get', null);
  const { getRoles } = useAuth();

  const rolesDelUsuario = getRoles();
  const camposAMostrar = () => {
    const puedeMostrarInspectors = rolesDelUsuario[0] !== 'inspector';

    return {
      licensePlate: true,
      inspectors: puedeMostrarInspectors,
      inspectionType: true,
      inspectionStatus: true,
      locations: true,
    };
  };
  const mostrarCampo = camposAMostrar();

  const handleFilterChange = (
    filterName: keyof FilterValues,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value; // Extraer el valor del evento
    const newFilters = { ...selectedFilters, [filterName]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleChange = (
    filterName: keyof FilterValues,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const newFilters = { ...selectedFilters, [filterName]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  useEffect(() => {
    const options: filterOptions = {
      purchaseChannel: data?.purchaseChannel ?? [],
      inspectionStatus: data?.inspectionStatus ?? [],
      inspectors: data?.inspectors ?? [],
      locations: data?.locations ?? [],
    };
    setFilterOptions(options);
  }, [data]);
  return (
    <div className={styles.filters}>
      {mostrarCampo.licensePlate && (
        <TextInput
          icon="MagnifyingGlassIcon"
          placeholder="Patente..."
          onChange={(val) => handleChange('licensePlate', val)}
          value={selectedFilters.licensePlate}
        />
      )}
      {mostrarCampo.locations && (
        <Select
          className={styles['input--x2']}
          icon={<BuildingOfficeIcon />}
          onChange={(val) => handleFilterChange('location', val)}
          options={filterOptions.locations}
          placeholder="Sucursal.."
          value={selectedFilters.location || null}
        />
      )}
      {mostrarCampo.inspectors && (
        <Select
          className={styles['input--x2']}
          icon={<UserIcon />}
          onChange={(val) => handleFilterChange('inspector', val)}
          options={filterOptions.inspectors}
          placeholder="Inspector.."
          value={selectedFilters.inspector || null}
        />
      )}
      {mostrarCampo.inspectionType && (
        <Select
          className={styles.input}
          icon={<DocumentTextIcon />}
          onChange={(val) => handleFilterChange('purchaseChannel', val)}
          options={filterOptions.purchaseChannel}
          placeholder="Canal de Compra.."
          value={selectedFilters.purchaseChannel || null}
        />
      )}
      {mostrarCampo.inspectionStatus && (
        <Select
          className={styles.input}
          icon={<ExclamationCircleIcon />}
          onChange={(val) => handleFilterChange('inspectionStatus', val)}
          options={filterOptions.inspectionStatus}
          placeholder="Estado.."
          value={selectedFilters.inspectionStatus || null}
        />
      )}
      {/*
      <DateInput placeholder="fecha 1" />
      <DateInput placeholder="fecha 2" />
      <DateInput placeholder="fecha 3" /> */}
    </div>
  );
};

export default Filters;
