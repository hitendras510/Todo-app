import { prismaClient } from "db/client";

export default async function Home() {
  const users = await prismaClient.user.findMany();
  return (
    <div>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

// export const revalidate = 60 // revalidate every 60 seconds
// or
export const dynamic = 'force-dynamic'