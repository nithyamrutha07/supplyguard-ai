
import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Truck,
  Factory,
  Boxes,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  BrainCircuit,
} from "lucide-react";

import HealthChart from "./HealthChart";
import AgentActivity from "./AgentActivity";

// Sample dashboard data
const incidents = [
  {
    id: "INC-104",
    issue: "Supplier delivery delay",
    supplier: "Nova Components",
    severity: "High",
    status: "Under Analysis",
  },
  {
    id: "INC-105",
    issue: "Raw material shortage",
    supplier: "Global Materials",
    severity: "Medium",
    status: "Monitoring",
  },
  {
    id: "INC-106",
    issue: "Shipment route disruption",
    supplier: "Prime Logistics",
    severity: "High",
    status: "Recovery Pending",
  },
];

const initialApprovals = [
  {
    id: 1,
    title: "Alternative Supplier Selection",
    description: "Replace delayed supplier SUP-104",
    cost: "₹1.8L",
    benefit: "2 days saved",
  },
  {
    id: 2,
    title: "Emergency Shipment Route",
    description: "Use an alternative transport route",
    cost: "₹85K",
    benefit: "1 day saved",
  },
];

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5 transition hover:border-cyan-500/40">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
        <TrendingUp size={17} className="text-emerald-400" />
      </div>

      <p className="mt-4 text-sm text-slate-400">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function Severity({ value }) {
  const styles =
    value === "High"
      ? "bg-rose-500/10 text-rose-400"
      : "bg-amber-500/10 text-amber-400";

  return (
    <span className={`rounded-full px-3 py-1 text-xs ${styles}`}>
      {value}
    </span>
  );
}

export default function Dashboard() {
  const [industry, setIndustry] = useState("Manufacturing");
  const [approvals, setApprovals] = useState(initialApprovals);
  const [activities, setActivities] = useState([
    "Supply chain health assessment completed",
    "Shipment SH-204 flagged for delay",
    "Inventory risk detected at Warehouse WH-02",
    "Recovery recommendation generated",
  ]);

  const handleApproval = (id, decision) => {
    const selected = approvals.find((item) => item.id === id);

    setApprovals((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setActivities((previous) => [
      `${selected.title} ${decision}`,
      ...previous,
    ]);
  };

  return (
    <main className="min-h-screen space-y-7 bg-[#07111f] p-4 text-white sm:p-6 lg:p-8">

      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-400" size={23} />
            <span className="text-xs font-bold tracking-[0.25em] text-cyan-400">
              SUPPLYGUARD AI
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            Supply Chain Control Tower
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Detect. Analyse. Decide. Recover.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            System Operational
          </span>

          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="rounded-xl border border-slate-700 bg-[#101e30] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
          >
            <option value="Manufacturing">Manufacturing</option>
            <option value="Pharmaceuticals">Pharmaceuticals</option>
          </select>
        </div>
      </header>

      {/* DEMO NOTICE */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
        <AlertTriangle size={16} />
        Demonstration environment — dashboard values are sample data.
      </div>

      {/* KEY PERFORMANCE INDICATORS */}
      <section>
        <SectionHeading
          title="Executive Overview"
          description={`Current ${industry} supply-chain performance at a glance`}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Supply Chain Health"
            value="94.8%"
            description="Overall network health"
            icon={Activity}
            color="bg-cyan-500/10 text-cyan-400"
          />

          <StatCard
            title="Active Disruptions"
            value="12"
            description="Across the supply network"
            icon={AlertTriangle}
            color="bg-rose-500/10 text-rose-400"
          />

          <StatCard
            title="Delayed Shipments"
            value="09"
            description="Awaiting resolution"
            icon={Truck}
            color="bg-amber-500/10 text-amber-400"
          />

          <StatCard
            title="Revenue at Risk"
            value="₹24.6L"
            description="Estimated financial exposure"
            icon={IndianRupee}
            color="bg-purple-500/10 text-purple-400"
          />
        </div>
      </section>

      {/* HEALTH ANALYTICS */}
      <section className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5">
        <HealthChart />
      </section>

      {/* AGENT OPERATIONS */}
      <section>
        <AgentActivity />
      </section>

      {/* OPERATIONAL RISK */}
      <section>
        <SectionHeading
          title="Operational Risk Overview"
          description="Current risks affecting supply-chain operations"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="High-Risk Suppliers"
            value="08"
            description="Require attention"
            icon={Factory}
            color="bg-rose-500/10 text-rose-400"
          />

          <StatCard
            title="Inventory Shortages"
            value="07"
            description="Materials below threshold"
            icon={Boxes}
            color="bg-amber-500/10 text-amber-400"
          />

          <StatCard
            title="Production Risks"
            value="04"
            description="Orders potentially affected"
            icon={Package}
            color="bg-purple-500/10 text-purple-400"
          />

          <StatCard
            title="Recovery Plans"
            value="06"
            description="Plans generated"
            icon={ShieldCheck}
            color="bg-emerald-500/10 text-emerald-400"
          />
        </div>
      </section>

      {/* FINANCIAL INTELLIGENCE */}
      <section className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5">
        <SectionHeading
          title="Financial Intelligence"
          description="Estimated disruption impact and recovery performance"
        />

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            ["Estimated Losses", "₹12.8L", "text-rose-400"],
            ["Recovery Costs", "₹3.2L", "text-amber-400"],
            ["Losses Avoided", "₹9.6L", "text-emerald-400"],
            ["Recovery ROI", "200%", "text-cyan-400"],
          ].map(([title, value, color]) => (
            <div key={title} className="rounded-xl bg-[#0b1726] p-4">
              <IndianRupee size={20} className={color} />
              <p className="mt-3 text-xs text-slate-400">{title}</p>
              <p className={`mt-1 text-xl font-bold ${color}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT INCIDENTS */}
      <section className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5">
        <SectionHeading
          title="Recent Supply Chain Incidents"
          description="Disruptions detected across the supply network"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-slate-700 text-xs text-slate-500">
              <tr>
                <th className="pb-4">Incident ID</th>
                <th>Disruption</th>
                <th>Supplier</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4 font-semibold text-cyan-400">
                    {incident.id}
                  </td>
                  <td className="text-slate-300">{incident.issue}</td>
                  <td className="text-slate-400">{incident.supplier}</td>
                  <td>
                    <Severity value={incident.severity} />
                  </td>
                  <td className="text-slate-300">{incident.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* HUMAN APPROVAL CENTER */}
      <section className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5">
        <SectionHeading
          title="Human Recovery Approval Center"
          description="Review AI-generated recovery recommendations before execution"
        />

        <div className="mb-4 text-xs text-amber-400">
          {approvals.length} pending approvals
        </div>

        {approvals.length === 0 ? (
          <p className="rounded-xl bg-[#0b1726] p-4 text-sm text-slate-400">
            No pending demonstration approvals.
          </p>
        ) : (
          <div className="space-y-3">
            {approvals.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-700 bg-[#0b1726] p-4 lg:flex-row lg:items-center"
              >
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-cyan-300">
                    Cost: {item.cost} · {item.benefit}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(item.id, "approved")}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 size={15} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleApproval(item.id, "rejected")}
                    className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/20"
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACTIVITY TIMELINE */}
      <section className="rounded-2xl border border-slate-700/70 bg-[#101e30] p-5">
        <SectionHeading
          title="Recent Activity & Audit Trail"
          description="Recent dashboard events and approval actions"
        />

        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={`${activity}-${index}`}
              className="flex items-start gap-3 border-b border-slate-800 pb-3"
            >
              <div className="rounded-lg bg-cyan-500/10 p-2">
                <Clock size={16} className="text-cyan-400" />
              </div>

              <div>
                <p className="text-sm text-slate-300">{activity}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Demonstration event · Current session
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
        SUPPLYGUARD AI · Intelligent Supply Chain Resilience Platform
        <p className="mt-1">
          Frontend demonstration · Backend and SAP HANA integration pending
        </p>
      </footer>
    </main>
  );
}
