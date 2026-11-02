
import React from "react";
import {
  Radio,
  Network,
  Truck,
  BrainCircuit,
  ShieldCheck,
  IndianRupee,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const agents = [
  {
    name: "Disruption Sensing Agent",
    role: "Monitors shipments, suppliers and inventory",
    icon: Radio,
    status: "Active",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    progress: 92,
    activity: "Detected a shipment delay from Supplier SUP-104",
    time: "2 min ago",
  },
  {
    name: "Impact Analysis Agent",
    role: "Analyses downstream business impact",
    icon: Network,
    status: "Active",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    progress: 78,
    activity: "Analysing 3 affected production orders",
    time: "3 min ago",
  },
  {
    name: "Logistics Agent",
    role: "Finds alternative routes and suppliers",
    icon: Truck,
    status: "Processing",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    progress: 64,
    activity: "Comparing alternative shipment routes",
    time: "4 min ago",
  },
  {
    name: "Recovery Planning Agent",
    role: "Creates and compares recovery strategies",
    icon: BrainCircuit,
    status: "Active",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    progress: 86,
    activity: "Generating recovery recommendations",
    time: "5 min ago",
  },
  {
    name: "Compliance Agent",
    role: "Checks industry rules and safety requirements",
    icon: ShieldCheck,
    status: "Monitoring",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    progress: 100,
    activity: "Validating supplier and quality requirements",
    time: "Just now",
  },
  {
    name: "Financial Intelligence Service",
    role: "Calculates losses, savings and recovery ROI",
    icon: IndianRupee,
    status: "Active",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    progress: 73,
    activity: "Estimating disruption losses and recovery costs",
    time: "6 min ago",
  },
];

function AgentActivity() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Multi-Agent Operations
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Monitor the six intelligence services coordinating supply-chain recovery.
          </p>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
          DEMO SIMULATION
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.name}
              className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-3 ${agent.bg}`}>
                    <Icon size={22} className={agent.color} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {agent.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {agent.role}
                    </p>
                  </div>
                </div>

                <span className="whitespace-nowrap rounded-full border border-slate-600 px-2.5 py-1 text-xs text-slate-300">
                  {agent.status}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-400">Task progress</span>
                  <span className="font-semibold text-cyan-300">
                    {agent.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-700/60 bg-[#0b1726] p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Activity size={14} className="text-cyan-400" />
                  Latest activity
                </div>

                <p className="mt-2 text-sm text-slate-300">
                  {agent.activity}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={13} />
                  {agent.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="text-xs leading-5 text-slate-400">
          Agent activity and progress values are sample demonstration data.
          They will become dynamic when connected to your Python backend and
          agent orchestrator.
        </p>
      </div>
    </section>
  );
}

export default AgentActivity;
