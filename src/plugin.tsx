import { DocumentCheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Inspections from '@/pages/Inspections';
import Inspection from '@/pages/Inspection';
import Form from '@/pages/Form';
import { PermissionsRutes } from './config';

const Plugin: App.Plugin = {
  title: 'Inspección',
  description: '',
  icon: <DocumentCheckIcon />,
  routes: [
    {
      path: '/inspecciones/:id',
      element: <Inspection />,
      title: 'Inspeccion',
      description: '',
      icon: <DocumentCheckIcon />,
      permissions: PermissionsRutes.Detail,
    },
    {
      path: 'inspecciones',
      element: <Inspections />,
      title: 'Inspecciones',
      description: '',
      icon: <DocumentCheckIcon />,
      menu: true,
      children: [
        {
          path: 'formulario/:id',
          element: <Form />,
          title: 'Formulario Inspeccion',
          description: '',
          icon: <PencilSquareIcon />,
          permissions: PermissionsRutes.Form,
        },
        {
          path: ':id',
          element: <Inspection />,
          title: 'Inspeccion',
          description: '',
          icon: <DocumentCheckIcon />,
          permissions: PermissionsRutes.Detail,
        },
      ],
    },
  ],
};

export default Plugin;
