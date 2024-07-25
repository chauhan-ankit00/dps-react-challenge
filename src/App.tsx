import { useEffect, useState } from 'react';
import dpsLogo from './assets/DPS.svg';
import './App.css';
import { User } from './types';
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(data => {
        const usersData: User[] = data.users;
        setUsers(usersData);
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://www.digitalproductschool.io/" target="_blank" rel="noopener">
          <img src={dpsLogo} className="logo" alt="DPS logo" />
        </a>
      </div>
      <div className="home-card">
        <UserList users={users} />
      </div>
    </>
  );
}

export default App;
