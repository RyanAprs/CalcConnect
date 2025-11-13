import { createClient } from "@/lib/supabase/server";
import type { DiscussionWithOperations } from "@/lib/types";
import { DiscussionCard } from "@/components/discussion-card";
import { NewDiscussionForm } from "@/components/new-discussion-form";
import { Header } from "@/components/header";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all discussions with their operations
  const { data: discussions } = await supabase
    .from("discussions")
    .select(
      `
      *,
      profiles!discussions_author_id_fkey (
        id,
        username,
        created_at
      ),
      operations (
        *,
        profiles!operations_author_id_fkey (
          id,
          username,
          created_at
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">CalcConnect</h1>
            <p className="text-lg text-muted-foreground">
              Communicate through numbers and mathematical operations
            </p>
          </div>

          {user ? (
            <NewDiscussionForm />
          ) : (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">
                Please sign in to start a new discussion
              </p>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">All Discussions</h2>
            {discussions && discussions.length > 0 ? (
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <DiscussionCard
                    key={discussion.id}
                    discussion={discussion as DiscussionWithOperations}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  No discussions yet. Be the first to start one!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
