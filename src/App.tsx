import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    const baseUrl: string =
      import.meta.env.MODE !== 'production'
        ? String(import.meta.env.VITE_BACKEND_URL ?? '')
        : '';
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-200 to-pink-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 rounded-3xl shadow-2xl px-10 py-16 max-w-lg mx-auto dark:bg-gray-900/90 dark:shadow-black/50">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-lg tracking-tight dark:from-purple-300 dark:to-pink-400">
          {message}
        </h1>
      </div>
    </div>
  );
}

export default App;
