"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Button from "../ButtonComponent/Button";
import { USER_ROLES } from "@/utils/constants";
import { useRouter } from "next/navigation";

function Navbar() {
  const { isAuthenticated, user, logout, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  // Check if user is on a specific contest page (not just /contests)
  const isOnContestPage = pathname?.match(/^\/contests\/\d+/);
  // Extract contest ID if on contest page
  const contestId = isOnContestPage
    ? pathname.match(/^\/contests\/(\d+)/)?.[1]
    : null;

  return (
    <>
      <div className="px-4 py-3 border-b-orange-500 border-b-2 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <img src="/0.png" alt="JudgeNot0 Logo" className="h-10" />
            <Link href={"/"} key={"home-route"}>
              <p className="font-semibold text-md lg:text-lg cursor-pointer hover:text-orange-500">
                <span className="transition-colors">Judge</span>
                <span className="text-orange-500">Not0</span>
              </p>
            </Link>
          </div>
          <div>
            <ul className="flex items-center gap-4">
              {/* Show different nav items based on role and page */}
              {isAuthenticated() &&
                (role === USER_ROLES.ADMIN || role === USER_ROLES.SETTER) && (
                  <>
                    {/* Admin/Setter: Only show Home link */}
                    <li>
                      <Link href={"/"} key={"home"}>
                        <p className="hover:text-orange-500 transition-colors">
                          Home
                        </p>
                      </Link>
                    </li>
                  </>
                )}

              {isAuthenticated() && role === USER_ROLES.USER && (
                <>
                  {/* User: Always show Contests link */}
                  <li>
                    <Link href={"/contests"} key={"contests"}>
                      <p className="hover:text-orange-500 transition-colors">
                        Contests
                      </p>
                    </Link>
                  </li>

                  {/* User on a specific contest page: Show My Submissions and Standings */}
                  {isOnContestPage && contestId && (
                    <>
                      <li>
                        <Link
                          href={`/contests/${contestId}/submissions`}
                          key={"submissions"}
                        >
                          <p className="hover:text-orange-500 transition-colors">
                            My Submissions
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/contests/${contestId}/standings`}
                          key={"standings"}
                        >
                          <p className="hover:text-orange-500 transition-colors">
                            Standings
                          </p>
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}

              {/* Guest users: Show Contests link */}
              {!isAuthenticated() && (
                <>
                  <li>
                    <Link href={"/contests"} key={"contests"}>
                      <p className="hover:text-orange-500 transition-colors">
                        Contests
                      </p>
                    </Link>
                  </li>

                  {/* Guest on a specific contest page: Show Standings */}
                  {isOnContestPage && contestId && (
                    <li>
                      <Link
                        href={`/contests/${contestId}/standings`}
                        key={"standings"}
                      >
                        <p className="hover:text-orange-500 transition-colors">
                          Standings
                        </p>
                      </Link>
                    </li>
                  )}
                </>
              )}

              {isAuthenticated() && (
                <>
                  {/* User Greeting */}
                  <li>
                    <span className="text-zinc-400">
                      Welcome,{" "}
                      <span className="text-orange-500 font-medium">
                        {user?.full_name || user?.username || "User"}
                      </span>
                    </span>
                  </li>

                  {/* Logout Button */}
                  <li>
                    <Button name={"Logout"} onClick={handleLogout} />
                  </li>
                </>
              )}

              {/* Login Button for Guests */}
              {!isAuthenticated() && (
                <li>
                  <Link href="/login" key={"login-btn"}>
                    <Button name={"Login"} />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
