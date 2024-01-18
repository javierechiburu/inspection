import Modal from 'ui/modal';
import type { InspectionType } from '../../types';
import styles from './modal-download-images.module.css';
import { useState, useEffect } from 'react';
import Button from 'ui/button';
import Select from 'ui/select';
import { useApi } from 'library/api';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { useAxios } from 'library/api';

type ModalDownloadImagesProps = {
  data: InspectionType;
  open: boolean;
  onClose: () => void;
};

interface GalleryTypeValues {
  value?: string;
  label?: string;
}

interface optionInterface {
  value: string;
  label: string;
}

const ActionList = ({ dataInspection }: { dataInspection: InspectionType }) => {
  const [type, setType] = useState<GalleryTypeValues>({});
  const [options, setOptions] = useState<optionInterface[]>([]);
  const URL = useAxios().api.getUri();

  const { data: res } = useApi<[]>(`bff/inspection/${dataInspection.id}/galleryType`, 'get', null);

  function handleSubmit() {
    if (type) {
      window.open(`${URL}inspection/${dataInspection.id}/gallery/${type.value}/images`, '_blank');
    }
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = event.target.value;
    const selectedOption = options.find((option) => option.value === selectedId);
    if (selectedOption) {
      const option = { value: selectedOption.value, label: selectedOption.label };
      setType(option);
    }
  };

  useEffect(() => {
    if (Array.isArray(res)) {
      const arrOptions = res.map((item: GalleryTypeValues) => ({
        label: item.label || '',
        value: item.value || '',
      }));
      setOptions(arrOptions);
    }
  }, [res]);

  return (
    <div className={styles.list}>
      <Select
        className={styles['input--x2']}
        icon={<BuildingOfficeIcon />}
        onChange={handleFilterChange}
        options={options}
        placeholder="Galería..."
        value={type.value || null}
      />
      <Button
        className={styles.margin}
        size="large"
        onClick={handleSubmit}
        variant="secondary"
        formTarget="_blank">
        Descargar
      </Button>
    </div>
  );
};

const ModalDownloadImages = ({ data, open, onClose }: ModalDownloadImagesProps) => {
  return (
    <Modal
      actions={<ActionList dataInspection={data} />}
      className={styles.panel}
      open={open}
      onClose={onClose}
      title="Descargar Galería"
      description={`.....`}
    />
  );
};

export default ModalDownloadImages;
