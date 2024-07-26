import React, { useEffect, useState } from 'react';
import { User } from '../types';
import useDebounce from '../useDebounce';
import './UserList.css';

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchName, setSearchName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [highlightOldest, setHighlightOldest] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  const debouncedSearchName = useDebounce(searchName, 1000);

  useEffect(() => {
    const uniqueCities = Array.from(new Set(users.map((user: User) => user.address.city)));
    setCities(uniqueCities);
  }, [users]);

  useEffect(() => {
    let filtered = users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(debouncedSearchName.toLowerCase())
    );
    if (selectedCity) {
      filtered = filtered.filter(user => user.address.city === selectedCity);
    }
    if (highlightOldest) {
      const oldestUsers = getOldestUsers(filtered);
      setFilteredUsers(oldestUsers);
    } else {
      setFilteredUsers(filtered);
    }
  }, [debouncedSearchName, selectedCity, highlightOldest, users]);

  const getOldestUsers = (users: User[]) => {
    const oldestUsers = users.reduce((acc: { [key: string]: User }, user) => {
      const city = user.address.city;
      if (!acc[city] || acc[city].age < user.age) {
        acc[city] = user;
      }
      return acc;
    }, {});
    return Object.values(oldestUsers);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const handleHighlightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightOldest(e.target.checked);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="user-list">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={handleNameChange}
        />
        <label htmlFor="city-select">Filter by city</label>
        <select id="city-select" onChange={handleCityChange} value={selectedCity}>
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={highlightOldest}
            onChange={handleHighlightChange}
          />
          Highlight Oldest
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.address.city}</td>
              <td>{formatDate(user.birthDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;

