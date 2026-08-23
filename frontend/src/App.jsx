import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Home, Login, Signup, NewPost, Users, Profile, GuestFeed, NotFound} from "./pages/Pages.js"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/guest" element={<GuestFeed />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<Profile />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;