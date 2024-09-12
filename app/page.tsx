import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
// import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
// import LogoutButton from "@/components/auth/logout-button";

export default async function Home() {
  // Get the current logged-in user with Clerk
  const user = await currentUser();

  if (!user) {
    // If no user is logged in, redirect to login page
    redirect("/login");
  }

  return (
    <div>
      <h1>Authenticated as {user.emailAddresses[0].emailAddress}</h1>
      {/* <LogoutButton /> */}
      <Button>Logout</Button>
    </div>
  );
}
