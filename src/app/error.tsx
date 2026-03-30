"use client";

import ErrorPage from "@/components/ErrorPage";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <ErrorPage
          title="Упс!"
          description="Возникла непредвиденная ошибка. Попробуйте ещё раз."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
