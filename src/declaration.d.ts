declare module 'custom-env';
declare module '*.module.css';

declare namespace App {
  type LayoutRouteProps = import('react-router-dom').LayoutRouteProps;
  interface Route extends LayoutRouteProps {
    title: string;
    description: string;
    icon: JSX.Element;
    children?: Route[];
    menu?: boolean;
    child?: Route[];
    permissions?: Role[];
  }
  type Plugin = {
    title: string;
    description: string;
    icon: JSX.Element;
    routes: Route[];
  };
}
