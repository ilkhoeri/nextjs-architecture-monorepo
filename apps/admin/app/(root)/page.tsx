import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/get-user';
import { PageLayout } from '@repo/shells';
import { BarChart } from '@repo/viz/bar';
import { User } from '@/types/user';
import Image from 'next/image';
import { ToolbarSubmitX } from '@repo/ui';

export default async function SetupPage() {
  // const users = await db.user.findMany();
  // if (!users || users.length === 0) return <RegisterModal />;

  const user = await getCurrentUser();

  if (!user?.email) redirect('/sign-in');

  return <Components user={user} />;
}

function Components({ user }: { user: User | null }) {
  return (
    <PageLayout>
      <div className="font-sans grid grid-rows-none items-center justify-items-center min-h-screen p-8 pb-20 gap-16 w-full max-w-md">
        <main className="flex flex-col gap-[32px] items-center sm:items-start">
          <div className="flex flex-row gap-2 items-center justify-evenly w-full">
            <Image className="dark:invert" src="/turborepo-logo.svg" alt="Turborepo logomark" width={38} height={38} />
            <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
          </div>
          <ol className="font-mono list-inside list-none text-sm/6 text-center sm:text-left">
            <li className="tracking-[-.01em] text-lg">Welcome back {user?.username}</li>
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">app/page.tsx</code>.
            </li>
          </ol>

          <div className="flex w-full gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
              Vercel
            </a>
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
              href="https://authjs.dev/getting-started/migrating-to-v5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/authjs-logo.webp" alt="Authjs logomark" width={20} height={20} />
              Auth.js
            </a>
          </div>
        </main>

        <ToolbarSubmitX />

        <BarChart />
      </div>
    </PageLayout>
  );
}
