
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

type Employee = {
  id: string;
  name: string;
  department: string;
};

type EmployeeContextType = {
  employees: Employee[];
  addEmployee: (name: string, department: string) => void;
  storageLoaded: boolean;
};

const STORAGE_KEY = '@management_employees';

const EmployeeContext = createContext<
  EmployeeContextType | undefined
>(undefined);

export function EmployeeProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'Rahul Sharma', department: 'IT' },
    { id: '2', name: 'Priya Patil', department: 'HR' }
  ]);

  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          setEmployees(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Error loading employees:', error);
      } finally {
        setStorageLoaded(true);
      }
    }

    loadEmployees();
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(employees)
    ).catch(error => {
      console.log('Error saving employees:', error);
    });
  }, [employees, storageLoaded]);

  const addEmployee = (name: string, department: string) => {
    setEmployees(current => [
      ...current,
      {
        id: Date.now().toString(),
        name,
        department
      }
    ]);
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, storageLoaded }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error(
      'useEmployees must be used inside EmployeeProvider'
    );
  }

  return context;
}
