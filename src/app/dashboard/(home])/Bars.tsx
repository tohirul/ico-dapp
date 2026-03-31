"use client";

export function Bars({
  data,
  labels,
  variant = "horizontal",
  showValues,
}: {
  data: number[];
  labels?: string[];
  variant?: "horizontal" | "vertical";
  showValues?: boolean;
}) {
  if (variant === "vertical") {
    return (
      <div className="h-full flex items-end gap-3">
        {data.map((value, i) => (
          <div
            key={i}
            className="group relative flex-1 flex flex-col h-full items-center gap-2"
          >
            {/* KPI TOOLTIP */}
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition text-xs bg-black/80 px-2 py-1 rounded">
              {labels?.[i]} {value}%
            </div>

            {/* BAR */}
            <div className="w-full h-full flex items-end">
              <div
                className="w-full rounded bg-primary transition-all duration-300 group-hover:opacity-80"
                style={{ height: `${value}%` }}
              />
            </div>

            {/* LABEL */}
            {labels && (
              <span className="text-xs text-muted-foreground">{labels[i]}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ===== HORIZONTAL =====
  return (
    <div className="space-y-3">
      {data.map((value, i) => (
        <div key={i}>
          {labels && (
            <div className="flex justify-between text-xs mb-1">
              <span>{labels[i]}</span>
              {showValues && <span>{value}</span>}
            </div>
          )}

          <div className="w-full h-2 bg-white/10 rounded">
            <div
              className="h-full bg-primary rounded"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
