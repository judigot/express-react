import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    const baseUrl =
      import.meta.env.MODE === 'production'
        ? ''
        : String(import.meta.env.VITE_BACKEND_URL ?? '');
    fetch(`${baseUrl}/api`)
      .then((res) => res.json())
      .then((data: { message: string }) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage('Failed to fetch');
      });
  }, []);

  return (
    <div style={{ zoom: '500%', textAlign: 'center' }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
