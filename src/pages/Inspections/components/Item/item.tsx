import { useState } from 'react';
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import Badge from 'ui/badge';
import Dropdown from 'ui/dropdown';
import type { InspectionType } from '../../types';
import Actions from '../Actions';
import styles from './item.module.css';
import getActions from '../../functions/getActions';
import useModals from '../../hooks/useModals';
import ModalInspector from '../Modal-Inspector';
import ModalDate from '../Modal-Date';
import ModalLocation from '../Modal-Location';
import ModalUpdateImages from '../Modal-Upload-Images';
import ModalDownloadImages from '../Modal-Download-Images';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'library/authentication';
import { useAxios } from 'library/api';

type ItemProps = {
  data: InspectionType;
};

const Item = ({ data }: ItemProps) => {
  const { getRoles } = useAuth();
  const [actions, setActions] = useState(false);
  const { api } = useAxios();
  const {
    toggleInspector,
    toggleDate,
    toggleLocation,
    toggleUploadImages,
    toggleDownloadImages,
    inspector,
    date,
    location,
    uploadImages,
    downloadImages,
    updateInspection,
  } = useModals();

  const navigate = useNavigate();
  const redirectToDetail = () => {
    navigate(`/inspecciones/${data.id}`);
  };
  const redirectToForm = () => {
    navigate(`/inspecciones/formulario`);
  };
  const redirectToFormId = () => {
    navigate(`/inspecciones/formulario/${data.id}`);
  };

  const startInspection = async () => {
    const response = await api.patch(`/inspection/${data.id}/status/open`);
    if (response) {
      navigate(`/inspecciones/formulario/${data.id}`);
    }
  };
  const toggleFunctions = {
    toggleInspector,
    toggleDate,
    toggleLocation,
    toggleUploadImages,
    toggleDownloadImages,
    redirectToDetail,
    redirectToForm,
    redirectToFormId,
    startInspection,
  };

  const handleInspectionUpdate = (updatedData: InspectionType) => {
    updateInspection(updatedData);
  };

  return (
    <li className={styles.item}>
      <div className={styles.mobile} onClick={() => setActions(true)} />
      <div className={styles.info}>
        <h3 className={styles.title}>
          {data.plate} {data.brand} {data.model} {data.year}
        </h3>
        <div className={styles.status}>
          <Badge variant="success">{data.status?.name}</Badge>
        </div>
        <p className={styles.type}>{data.type?.name}</p>
        <p className={styles.line}>
          <Entry icon={<UserIcon />} value={data.user?.name} />
          <Entry icon={<BuildingOfficeIcon />} value={data.branch?.name || 'Particular'} />
        </p>

        <p className={styles.line}>
          {data.scheduled && data.scheduled !== '' && data.scheduled !== ' ' ? (
            <Entry
              icon={<CalendarDaysIcon />}
              value={`${new Date(data.scheduled).toLocaleDateString()} ${new Date(
                data.scheduled
              ).toLocaleTimeString()}`}
            />
          ) : null}
          {data.address ? <Entry icon={<MapPinIcon />} value={data.address} /> : null}
        </p>

        <p className={styles.dates}>
          {data.created ? (
            <Entry icon={<b>Creada</b>} value={new Date(data.created).toLocaleDateString()} />
          ) : null}
          {data.modified && !data.completed ? (
            <Entry icon={<b>Modificada</b>} value={new Date(data.modified).toLocaleDateString()} />
          ) : null}
          {data.completed ? (
            <Entry icon={<b>Completada</b>} value={new Date(data.completed).toLocaleDateString()} />
          ) : null}
        </p>
      </div>
      <div className={styles.actions}>
        {getActions(toggleFunctions, getRoles(), data)[0].length !== 0 ? (
          <Dropdown items={getActions(toggleFunctions, getRoles(), data)} />
        ) : null}
      </div>
      <Actions
        data={data}
        open={actions}
        onClose={() => setActions(false)}
        toggleFunctions={toggleFunctions}
      />
      <ModalInspector
        data={data}
        open={inspector}
        onClose={() => toggleInspector()}
        onUpdate={handleInspectionUpdate}
      />
      <ModalDate
        data={data}
        open={date}
        onClose={() => toggleDate()}
        onUpdate={handleInspectionUpdate}
      />
      <ModalLocation
        data={data}
        open={location}
        onClose={() => toggleLocation()}
        onUpdate={handleInspectionUpdate}
      />
      <ModalUpdateImages data={data} open={uploadImages} onClose={() => toggleUploadImages()} />
      <ModalDownloadImages
        data={data}
        open={downloadImages}
        onClose={() => toggleDownloadImages()}
      />
    </li>
  );
};

export default Item;

const Entry = ({ icon, value }: { icon: JSX.Element; value: React.ReactNode }) => {
  return (
    <span className={styles.entry}>
      {icon}
      {value}
    </span>
  );
};
