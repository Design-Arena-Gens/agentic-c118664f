import { useState } from 'react';
import { useAuth, type UserRole } from '../auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('renter');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const go = (r: UserRole) => navigate(r === 'owner' ? '/owner' : '/renter');

  return (
    <div className="max-w-md mx-auto grid gap-4">
      <h2 className="text-2xl font-semibold">Create account</h2>
      {error && <div className="text-red-600">{error}</div>}
      <select className="border rounded p-2" value={role} onChange={(e)=>setRole(e.target.value as UserRole)}>
        <option value="owner">Owner</option>
        <option value="renter">Renter</option>
      </select>
      <input className="border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="px-3 py-2 rounded bg-navy text-beige" onClick={async ()=>{
        try { await signup(email, password, role); go(role); } catch(e:any){ setError(e.message) }
      }}>Create account</button>
      <button className="px-3 py-2 rounded border border-navy text-navy" onClick={async ()=>{
        try { await loginWithGoogle(role); go(role); } catch(e:any){ setError(e.message) }
      }}>Sign up with Google</button>
      <p className="text-sm">Have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
