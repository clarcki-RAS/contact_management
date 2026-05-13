import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import './globalstyle.css'
import Dashboard from './dashboard';
import ProfilePopup from './Profile';
import Employee from './Employe';
import FormulaireAPMF from './Employee-register';
import Contact from './Sim-card';
import FormulaireContact from './Contact-register';
import LoginForm from './Login-forms';
import KeyVerification from './key-verification';
import Rapport from './Report';
import ReportRegister from './ReportRegister';
import Forfait from './Forfait';
import EmployeUpdate from './Employee-update';

// import RootLayout from './RootLayout';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
      {/* <Route element={ <RootLayout/> }> */}
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register open={false} onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Login-forms" element={<LoginForm />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Rapport" element={<Rapport />} />
          <Route path="/Forfait" element={<Forfait open={false} handleClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
          <Route path="/Report-Register" element={<ReportRegister open={false} handleClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
          <Route path="/Key-Verification" element={<KeyVerification onVerificationFail={function (): void {
          throw new Error('Function not implemented.');
        } } onVerificationSuccess={function (): void {
          throw new Error('Function not implemented.');
        } } />} />

          <Route path="/Contact-register" element={<FormulaireContact open={false} handleClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
          <Route path="/Employe-register" element={<FormulaireAPMF open={false} handleClose={function (): void {
          throw new Error('Function not implemented.');
        } } onSuccess={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
          <Route path="/Sim-card" element={<Contact />} />
          <Route path="/EmployeUpdate" element={<EmployeUpdate open={undefined} handleClose={undefined} employee={undefined} onUpdate={undefined} />} />
          <Route path="/ProfilePopup" element={<ProfilePopup open={false} onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        {/* </Route> */}
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
