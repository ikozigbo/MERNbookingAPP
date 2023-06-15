import axios from "axios";
const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        const { data } = await axios.get("/profile");
        setUser(data);
        setReady(true);
      }
    }
    fetchData();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
