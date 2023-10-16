'use client';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { format } from 'date-fns';

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // esta deberia ser la url: (funciona pero no aqui)
    // fetch('https://grhrdrb9v0.execute-api.us-east-1.amazonaws.com/api/commits')
    Promise.all([
      fetch('https://api.github.com/repos/accel33/github-backend/commits'),
      fetch('https://api.github.com/repos/accel33/github-frontend/commits'),
    ])
      .then((res) => res.json())
      .then((data) => {
        console.log('working');
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        alert('Ocurrio un error en el fetch');
        setLoading(false);
      });
  }, []);

  const handleClick = () => {
    window.location.reload();
  };

  if (isLoading)
    return (
      <div className="bg-slate-700 p-16 -z-10">
        <center>
          <p>Loading...</p>
        </center>
      </div>
    );
  else if (!data)
    return (
      <div className="bg-slate-700 p-16 -z-10">
        <center>
          <p>No se obtuvo data del fetch.</p>
        </center>
      </div>
    );
  else {
    const stringData = JSON.stringify(data);
    const parsedData = JSON.parse(stringData);
    console.log(parsedData);
    if (!parsedData.message)
      return (
        <div className="container">
          <Head>
            <title>Github Commits</title>
            <meta name="description" content="fulltimeforce" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="flex p-4 block ps-20">
            <Image
              className="relative mr-auto ml-auto"
              src="/fulltimeforce.svg"
              alt="FULLTIMEFORCE Logo"
              width={128}
              height={64}
              priority
            />
          </div>
          <main className="ps-20 flex-col justify-between items-center h-screen">
            <p>
              <Button
                className="bg-blue-500 text-white p-2"
                onClick={handleClick}
              >
                REFRESH
              </Button>
            </p>

            <table>
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((item, id) => (
                  <tr key={id}>
                    <td className="px-3 text-center bg-slate-200">
                      {item.sha}
                    </td>
                    <td className="px-3 text-center bg-slate-300">
                      {item.commit.author.name}
                    </td>
                    <td className="px-3 text-center bg-slate-400">
                      {format(
                        new Date(item.commit.committer.date),
                        'dd/MM/yyyy HH:mm:ss'
                      )}
                    </td>
                    <td className="px-3 text-center bg-slate-300">
                      {item.commit.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      );
    else
      return (
        <div>
          <center>
            <p>{parsedData.message}</p>
          </center>
        </div>
      );
  }
}
