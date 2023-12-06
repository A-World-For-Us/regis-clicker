import { useEffect } from 'react';
import App from './App';
import Bandeau from './Bandeau';
import { useState } from 'react';
import useSWR from 'swr';
import useSWMRMutation from 'swr/mutation';

const ENDPOINT = 'https://pug38ww771.execute-api.eu-west-1.amazonaws.com';
const KEY = 'regis-cliker-id';
const fetcher = (...args) => fetch(...args).then(res => res.json());
const postFetcher = async (url, { arg }) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  }).then(res => res.json());
};

const Page = () => {
  const [message, setMessage] = useState('Bienvenue !');

  /* Fetch Id and Name from localStorage or API */
  const [[name, id], setIdName] = useState(fromLocalStorage());
  const { data: userData } = useSWR(
    name ? null : `${ENDPOINT}/new_id`,
    fetcher,
  );
  useEffect(() => {
    if (userData) {
      toLocalStorage(userData.userName, userData.userId);
      setIdName([userData.userName, userData.userId]);
    }
  }, [userData]);

  useEffect(() => {
    if (name) {
      setMessage('Bienvenue ' + name + ' !');
    }
  }, [name]);

  /* Fetch Top 3 from API */
  const [leaderMessage, setLeaderMessage] = useState('');
  const { data: leaderboardData } = useSWR(`${ENDPOINT}/leaderboard`, fetcher, {
    refreshInterval: 5 * 60_000,
  });
  useEffect(() => {
    if (leaderboardData) {
      const leaders = leaderboardData
        .filter(it => it.name && it.score !== 0)
        .slice(0, 3)
        .map(it => `${it.name}: ${it.score}`)
        .join(' | ');

      setLeaderMessage(`Meilleurs scores du jours : ${leaders}`);
    }
  }, [leaderboardData]);

  /* Push my score */
  const [score, setScore] = useState(0);
  const [rankMessage, setRankMessage] = useState('');
  const { trigger: postScore } = useSWMRMutation(
    `${ENDPOINT}/score`,
    postFetcher,
  );
  const { data: myRankData, trigger: fetchScore } = useSWMRMutation(
    `${ENDPOINT}/my_rank`,
    postFetcher,
  );
  useEffect(() => {
    if (score !== 0 && id) {
      postScore({ userId: id, score: score });
      fetchScore({ userId: id });
    }
  }, [score, id, postScore, fetchScore]);
  useEffect(() => {
    if (name && myRankData) {
      const { rank, playerCount } = myRankData;
      setRankMessage(
        `Vous êtes dans le ${Math.round(
          100 * ((rank + 1) / playerCount),
        )}% des meilleurs joueurs !`,
      );
    }
  }, [score, myRankData, name]);

  return (
    <>
      <Bandeau prepend={message} append={leaderMessage + ' ' + rankMessage} />
      <App setScore={setScore} />
    </>
  );
};

const toLocalStorage = (name, id) => {
  localStorage.setItem(KEY, JSON.stringify({ id, name }));
};

const fromLocalStorage = () => {
  if (localStorage.getItem(KEY) != null) {
    const { id: localId, name: localName } = JSON.parse(
      localStorage.getItem(KEY),
    );
    return [localName, localId];
  } else return [null, null];
};

export default Page;
