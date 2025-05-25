
import { useState } from "react";

/**
 * Replace the logic below with real authentication when ready.
 * For demo purposes: user is unauthenticated by default.
 */
export function useAuthStatus() {
  // Simulate unauthenticated by default
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Uncomment to test authenticated flow:
  // const [isAuthenticated, setIsAuthenticated] = useState(true);

  return { isAuthenticated, setIsAuthenticated };
}
