import { Suspense } from "react";
import Link from "next/link";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono uppercase tracking-widest leading-relaxed">
        {params?.error ? `System Error // ${params.error}` : "Unknown System Failure Detected"}
      </div>
      <p className="text-sm text-muted-foreground font-sans tracking-tight leading-relaxed">
        The PRIMEPOLICY-AI gateway encountered a protocol violation or internal failure. Please re-authenticate or contact system administrators.
      </p>
    </div>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Link href="/" className="font-mono font-bold text-2xl tracking-tighter flex items-center gap-2 mb-2">
            <span className="bg-primary text-primary-foreground px-2 py-1">P</span>
          </Link>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-widest text-shadow-industrial text-center text-destructive">Protocol Violation</h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-tight">Access Denied [P-AI-ERR-01]</p>
        </div>

        <div className="border border-border bg-card/50 backdrop-blur-sm p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
          <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">Critical // V4</div>
          
          <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
            <ErrorContent searchParams={searchParams} />
          </Suspense>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <Link href="/auth/login" className="text-xs font-mono uppercase text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
              Return to Gateway
            </Link>
          </div>
        </div>

        <div className="flex justify-center gap-4 opacity-50">
          <div className="w-1 h-1 bg-border" />
          <div className="w-1 h-1 bg-destructive" />
          <div className="w-1 h-1 bg-border" />
        </div>
      </div>
    </div>
  );
}
