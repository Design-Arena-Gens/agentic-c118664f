import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, loginWithGoogle, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const go = (r: string | null) => navigate(r === 'owner' ? '/owner' : '/renter');

  return (
    <div className="max-w-md mx-auto grid gap-4">
      <h2 className="text-2xl font-semibold">Login</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input className="border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="px-3 py-2 rounded bg-navy text-beige" onClick={async ()=>{
        try { await login(email, password); go(role); } catch(e:any){ setError(e.message) }
      }}>Login</button>
      <button className="px-3 py-2 rounded border border-navy text-navy" onClick={async ()=>{
        try { await loginWithGoogle(); go(role); } catch(e:any){ setError(e.message) }
      }}>Continue with Google</button>
      <p className="text-sm">No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
