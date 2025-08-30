import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="text-center">
      {isLoggedIn ? (
        <h1 className="text-4xl font-bold text-green-400">
          You have logged in successfully!
        </h1>
      ) : (
        <>
          <h1 className="text-4xl font-bold hover:text-pink-300">Welcome To Oauth 2.0</h1>
          <p className="mt-2 text-slate-400 hover:text-pink-300">Use the top-right links to login or sign up.</p>
        </>
      )}
    </div>
  );
}
