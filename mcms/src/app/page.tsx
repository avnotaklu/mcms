import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); // Redirects root to "/dashboard"
  return null;
}
