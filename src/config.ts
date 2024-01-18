export enum Role {
  Inspector = 'inspector',
  Supervisor = 'supervisor',
  Viewer = 'viewer',
  B2CEditor = 'b2c-editor',
  HomeCoordinator = 'home-coordinator',
  CRMBuyer = 'crm-buyer',
}

export const PermissionsRutes = {
  Form: [Role.Supervisor],
  Detail: [Role.Supervisor, Role.Inspector, Role.Viewer, Role.B2CEditor],
};
