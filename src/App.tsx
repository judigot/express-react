import React, { useEffect } from 'react';

interface IData {
  message: string;
}

function App() {
  const [data, setData] = React.useState<IData | undefined>(undefined);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'api/hello';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const url = backendUrl ? `${String(backendUrl)}/${String(apiUrl)}` : `/${String(apiUrl)}`;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result: IData | undefined) => {
        if (result) {
          setData(result);
        }
      })
      .catch((error: unknown) => {
        throw error instanceof Error ? error : new Error(String(error));
      });
  }, []);

  return (
    <div style={{ zoom: '500%', textAlign: 'center' }}>
      <pre>
        <code>{JSON.stringify(data, null, 4)}</code>
      </pre>
    </div>
  );
}

export default App;
