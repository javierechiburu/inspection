import { Route, Routes } from 'react-router-dom';
import Inspection from '@/pages/Inspection';
import Inspections from '@/pages/Inspections';
import Form from '@/pages/Form';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Inspections />} />
      <Route path="/formulario" element={<Form />} />
      <Route path="/:id" element={<Inspection />} />
    </Routes>
  );
};

export default App;
