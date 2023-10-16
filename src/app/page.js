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
    let url1 = 'https://api.github.com/repos/accel33/github-backend/commits';
    let url2 = 'https://api.github.com/repos/accel33/github-frontend/commits';
    Promise.all([
      fetch(url1).then((value) => value.json()),
      fetch(url2).then((value) => value.json()),
    ])
      .then((value) => {
        console.log(value[0]);
        console.log(value[1]);

        return [...value[0], ...value[1]];
      })
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
        <div className="mr-auto ml-auto">
          <Head>
            <title>Github Commits</title>
            <meta name="description" content="fulltimeforce" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="flex p-4 block">
            <Image
              className="relative mr-auto ml-auto"
              src="/fulltimeforce.svg"
              alt="FULLTIMEFORCE Logo"
              width={128}
              height={64}
              priority
            />
          </div>
          <main className=" h-screen flex flex-col items-center ">
            <div className="">
              <button
                className="bg-blue-500 text-white p-2 rounded-lg my-10"
                onClick={handleClick}
              >
                REFRESH
              </button>
            </div>

            <table className="mr-auto ml-auto">
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
