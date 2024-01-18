import type { InspectionConfig, InspectionData } from './types';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAxios } from 'library/api';
import Heading from '@/components/Heading';
import Actions from './components/Actions';
import Menu from './components/Menu';
import Group from './components/Group';
import WizardProvider from './providers/wizard.provider';
import styles from './form.module.css';

const Form = () => {
  const { id } = useParams();
  const { api } = useAxios();
  const [data, setData] = useState<InspectionData>();
  const [config, setConfig] = useState<InspectionConfig>();
  const [error, setError] = useState(false);

  const fetchData = useCallback(
    async (id: string) => {
      await api
        .get(`bff/inspection/${id}/form`)
        .then((res) => setData(res.data))
        .catch(() => setError(true));
    },
    [api]
  );

  useEffect(() => {
    if (id) fetchData(id);
  }, [fetchData, id]);

  const fetchConfig = useCallback(
    async (data: InspectionData) => {
      await api
        .get(`bff/config/${data.configId}`)
        .then((res) => setConfig(res.data))
        .catch(() => setError(true));
    },
    [api]
  );

  useEffect(() => {
    if (data) fetchConfig(data);
  }, [data, fetchConfig]);

  if (!data || !config) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>ERROR</div>;
  }

  return data && id && config ? (
    <WizardProvider id={id} config={config} data={data}>
      <div className={styles.wrapper}>
        <Heading
          className={styles.heading}
          title="Formulario Inspeccion"
          section="Inspección"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing.">
          <Actions />
        </Heading>
        <div className={styles.container}>
          <Menu groups={config.groups} />
          <div className={styles.content}>
            {config.groups.map((group, index) => (
              <Group key={group.id} group={group} index={index} total={config.groups.length} />
            ))}
          </div>
        </div>
      </div>
    </WizardProvider>
  ) : null;
};

export default Form;
