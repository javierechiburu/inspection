/* eslint-disable @typescript-eslint/no-unused-vars */
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { ToggleFunctions, InspectionType } from '../types';
import { Role } from '@/config';

const getActions = (
  toggleFunctions?: ToggleFunctions,
  userRoles?: string[],
  dataInspection?: InspectionType
) => {
  const actions = [
    {
      key: '1',
      icon: <PencilSquareIcon />,
      label: 'Ver Detalle',
      onClick: toggleFunctions?.redirectToDetail || (() => {}),
    },
    {
      key: '2',
      icon: <PencilSquareIcon />,
      label: 'Asignar Inspector',
      onClick: toggleFunctions?.toggleInspector || (() => {}),
    },
    {
      key: '3',
      icon: <PencilSquareIcon />,
      label: 'Cambiar Agenda',
      onClick: toggleFunctions?.toggleDate || (() => {}),
    },
    {
      key: '7',
      icon: <PencilSquareIcon />,
      label: 'Cambiar Dirección',
      onClick: toggleFunctions?.toggleLocation || (() => {}),
    },
    {
      key: '4',
      icon: <PencilSquareIcon />,
      label: 'Iniciar Inspeccion',
      onClick: toggleFunctions?.startInspection || (() => {}),
    },
    {
      key: '5',
      icon: <PencilSquareIcon />,
      label: 'Continuar Inspeccion',
      onClick: toggleFunctions?.redirectToFormId || (() => {}),
    },
    {
      key: '6',
      icon: <PencilSquareIcon />,
      label: 'Editar Inspeccion',
      onClick: toggleFunctions?.redirectToFormId || (() => {}),
    },
    {
      key: '8',
      icon: <PencilSquareIcon />,
      label: 'Agregar Fotos',
      onClick: toggleFunctions?.toggleUploadImages || (() => {}),
    },
    {
      key: '9',
      icon: <PencilSquareIcon />,
      label: 'Descargar Fotos',
      onClick: toggleFunctions?.toggleDownloadImages || (() => {}),
    },
  ];

  const permissions: { [key in Role]: string[] } = {
    [Role.Inspector]: ['1', '4', '5', '6'],
    [Role.Supervisor]: ['1', '2', '4', '5', '6', '8', '9'],
    [Role.Viewer]: ['1'],
    [Role.B2CEditor]: ['1', '8', '9'],
    [Role.HomeCoordinator]: [],
    [Role.CRMBuyer]: ['1'],
  };

  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  const userPermissions = userRoles?.reduce<string[]>((acc, role) => {
    const rolePermissions = permissions[role as keyof typeof permissions] || [];
    return [...new Set([...acc, ...rolePermissions])];
  }, []);

  let filteredActions = actions.filter((action) => userPermissions?.includes(action.key));

  //Agregar validaciones de lógica de inspección
  //Si la inspección tiene isDraft nulo, mostrar iniciar inspección (consume un endpoint en particular ya que genera un evento)
  //Si la inspección tiene isDraft true, simplemente abrir continuar inspección
  //Si la inspección tiene isDraft false, significa que es una inspección terminada
  //Si la inspección no está terminada (isDraft estrictamente FALSE significa que la inspección está terminada), no tiene que mostrar el detalle

  if (dataInspection) {
    switch (dataInspection.isDraft && dataInspection.isDraft !== null) {
      case true:
        filteredActions = filteredActions.filter(
          (action) =>
            action.key !== '1' &&
            action.key !== '4' &&
            action.key !== '6' &&
            action.key !== '8' &&
            action.key !== '9'
        );
        break;
      case false:
        filteredActions = filteredActions.filter(
          (action) => action.key !== '4' && action.key !== '5'
        );
        break;
      default:
        filteredActions = filteredActions.filter(
          (action) =>
            action.key !== '1' &&
            action.key !== '5' &&
            action.key !== '6' &&
            action.key !== '8' &&
            action.key !== '9'
        );
    }
  }

  return [filteredActions];
};

export default getActions;
