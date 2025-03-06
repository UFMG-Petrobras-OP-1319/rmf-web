import { createMicroApp } from '../components';

export default createMicroApp(
  'petro-table',
  'Petrobras',
  () => import('../components/petrobras/petro-table'),
  () => ({}),
);
