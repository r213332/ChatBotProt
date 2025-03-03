import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  return (
    <form
      action={async () => {
        "use server";
        const session = new FormData();
        await signIn("credentials", session);
        redirect("/");
      }}
    >
      <button type="submit">Sign In</button>
    </form>
  );
}
