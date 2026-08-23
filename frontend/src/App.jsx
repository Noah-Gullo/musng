import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Home, Login, Signup, NewPost, Users, Profile, NotFound} from "./pages/Pages.js"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:id" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;