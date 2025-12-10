// import { ReactNode } from "react";
// import { redirect } from "next/navigation";
// import Sidebar from "@/app/ui/sidebar";
// import { cookies } from "next/headers";
// import { createClient } from "@supabase/supabase-js";

// type Props = {
//   children: ReactNode;
// };

// export default async function DashboardLayout({ children }: Props) {
//   // Await the cookies if your version returns a Promise
//   const cookieStore = await cookies();

//   // Create Supabase client
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       auth: {
//         storage: {
//           getItem: (key: string) => cookieStore.get(key)?.value ?? null,
//           setItem: () => {}, // server-only, no-op
//           removeItem: () => {}, // server-only, no-op
//         },
//         autoRefreshToken: false,
//       },
//     }
//   );

//   const { data: { session } = {} } = await supabase.auth.getSession();

//   if (!session?.user) {
//     redirect("/login");
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <main className="flex-1 p-10">{children}</main>
//     </div>
//   );
// }

// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// import { ReactNode } from "react";
// import { cookies } from "next/headers";
// import { createClient } from "@supabase/supabase-js";
// import { redirect } from "next/navigation";
// import Sidebar from "@/app/ui/sidebar";

// type Props = {
//   children: ReactNode;
// };

// export default async function DashboardLayout({ children }: Props) {
//   // Await the cookies!
//   const cookieStore = await cookies();

//   // Create Supabase client (server-side)
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       auth: {
//         storage: {
//           getItem: (key: string) => cookieStore.get(key)?.value ?? null,
//           setItem: () => {}, // no-op server-only
//           removeItem: () => {}, // no-op server-only
//         },
//         autoRefreshToken: false,
//       },
//     }
//   );

//   // Get session server-side
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session || !session.user) {
//     redirect("/login");
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <main className="flex-1 p-10">{children}</main>
//     </div>
//   );
// }

// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// app/dashboard/layout.tsx

// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/app/ui/sidebar";
import { createServerClient } from "@supabase/ssr";

type Props = { children: ReactNode };

export default async function DashboardLayout({ children }: Props) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // For SSR only — often no-op
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
