export interface Address {
  city: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string; // Assuming the date is a string in the format "YYYY-MM-DD"
  age: number;
  address: Address;
}
