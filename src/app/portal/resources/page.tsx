import { FileText, Download, Play } from "lucide-react";

// Exercise plan type for when therapists assign plans (future integration)
interface ExercisePlan {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "programme";
  weeks: number;
  exercises: { name: string; sets: number; reps: string; videoUrl?: string }[];
}

// Placeholder — will be populated by therapist via admin when plans are assigned
const PLANS: ExercisePlan[] = [];

export default function ResourcesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Exercise Plans
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          Programmes assigned by your therapist
        </p>
      </div>

      {PLANS.length === 0 ? (
        <div>
          <div className="bg-white rounded-xl border border-[#e3e8ee] p-12 text-center mb-6" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
            <FileText className="w-10 h-10 text-[#e3e8ee] mx-auto mb-4" />
            <h2 className="text-base text-[#0d253d] mb-2" style={{ fontWeight: 400 }}>
              No exercise plans yet
            </h2>
            <p className="text-sm text-[#64748d] max-w-sm mx-auto" style={{ fontWeight: 300 }}>
              Your therapist will assign personalised exercise programmes here after your session.
              Check back after your first appointment.
            </p>
          </div>

          {/* General resources */}
          <h2 className="text-base text-[#0d253d] mb-4" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
            General Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Posture Guide", desc: "Improve everyday posture and reduce back pain", type: "pdf" },
              { title: "Breathing Techniques", desc: "Diaphragmatic breathing for pain relief and recovery", type: "pdf" },
              { title: "Home Stretching Routine", desc: "15-minute daily mobility programme", type: "pdf" },
              { title: "Ice vs Heat Guide", desc: "When to use ice or heat for injuries", type: "pdf" },
            ].map((r) => (
              <div
                key={r.title}
                className="bg-white rounded-xl border border-[#e3e8ee] p-5 flex items-start gap-4"
                style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
              >
                <div className="w-9 h-9 rounded-lg bg-[#f0fdf9] flex items-center justify-center shrink-0">
                  {r.type === "pdf" ? (
                    <FileText className="w-4 h-4 text-[#0d9488]" />
                  ) : (
                    <Play className="w-4 h-4 text-[#0d9488]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                    {r.title}
                  </p>
                  <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>
                    {r.desc}
                  </p>
                </div>
                <a
                  href="/resources"
                  className="text-xs text-[#0d9488] hover:underline shrink-0"
                  style={{ fontWeight: 300 }}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-[#e3e8ee] p-5"
              style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                    {plan.title}
                  </p>
                  <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>
                    {plan.description} · {plan.weeks} weeks
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-[#0d9488] border border-[#0d9488]/30 rounded-full px-3 py-1.5 hover:bg-[#f0fdf9] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
              <div className="space-y-2">
                {plan.exercises.map((ex) => (
                  <div key={ex.name} className="flex items-center justify-between text-xs py-2 border-t border-[#f6f9fc]">
                    <span className="text-[#0d253d]" style={{ fontWeight: 300 }}>{ex.name}</span>
                    <span className="text-[#64748d]" style={{ fontWeight: 300 }}>
                      {ex.sets} sets × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
