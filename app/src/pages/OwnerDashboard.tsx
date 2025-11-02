import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';

interface Property { id?: string; name: string; address: string; ownerId: string }

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const canWrite = Boolean(db && user);

  useEffect(() => {
    if (!db || !user) return;
    const q = query(collection(db, 'properties'), where('ownerId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Property) }));
      setProperties(items);
    });
  }, [user]);

  async function addProperty() {
    if (!db || !user) return;
    await addDoc(collection(db, 'properties'), { name, address, ownerId: user.uid, createdAt: Date.now() });
    setOpen(false); setName(''); setAddress('');
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">Owner Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded border">
          <div className="text-sm opacity-70">Properties</div>
          <div className="text-3xl font-bold">{properties.length}</div>
        </div>
      </div>
      <div>
        <button className="px-3 py-2 rounded bg-navy text-beige" disabled={!canWrite} onClick={()=>setOpen(true)}>Add Property</button>
      </div>
      <ul className="grid gap-2">
        {properties.map(p => (
          <li key={p.id} className="p-3 rounded border">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm opacity-70">{p.address}</div>
          </li>
        ))}
      </ul>
      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <div className="w-full max-w-md rounded bg-beige dark:bg-charcoal p-4 grid gap-3">
            <h3 className="text-lg font-semibold">Add Property</h3>
            <input className="border rounded p-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="border rounded p-2" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-2 rounded border" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="px-3 py-2 rounded bg-navy text-beige" onClick={addProperty}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
