import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      setUser(response.data);
      alert("Login successful");
      setRedirect(true);
    } catch (error) {
      alert("Login failed");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around  j">
      <div className="md-64">
        <h1 className="text-4xl text-center">Login</h1>
        <form className="max-w-md mx-auto mt-5" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link to={"/register"} className="text-primary underline">
              Resgister now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
