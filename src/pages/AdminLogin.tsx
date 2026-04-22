import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { Button, Card } from "../components/ui";
import { loginAdmin, readStoredToken, storeAdminToken } from "../lib/admin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingToken = readStoredToken();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  if (existingToken) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const result = await loginAdmin(username, password);
      storeAdminToken(result.token);
      navigate("/admin", { replace: true, state: { from: location.pathname } });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Seo
        title="Admin Login | RISC-V Scholars"
        description="Administrator sign-in for submission review and institution enrichment workflows."
        pathname="/admin/login"
        robots="noindex,nofollow"
      />
      <div className="mb-10 border-b border-border pb-8">
        <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3">
          Admin login
        </div>
        <h1 className="text-4xl font-serif text-primary mb-4">
          Sign in to manage submissions and institution reviews.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          This login issues a short-lived admin session for the review tools. You no longer need to
          paste the raw management token into the browser.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-11 h-11 bg-surface-alt border border-border flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-2xl">Administrator sign-in</h2>
            <p className="text-sm text-gray-600 mt-1">
              Use your assigned administrator username and password.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-4 text-sm border border-red-200 bg-red-50 text-red-800 px-3 py-2">
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
