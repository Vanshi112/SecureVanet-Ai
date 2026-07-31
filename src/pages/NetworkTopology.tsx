import { motion } from "framer-motion";
import {
  Cpu,
  Router,
  Car,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useState } from "react";

type AttackType = "Normal" | "DoS" | "RPM" | "Gear" | "Steering";

interface NodeProps {
  title: string;
  icon: any;
  attack?: boolean;
}

function ECUNode({
  title,
  icon: Icon,
  attack = false,
}: NodeProps) {
  return (
    <motion.div
      animate={
        attack
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(239,68,68,0)",
                "0 0 35px rgba(239,68,68,0.8)",
                "0 0 0px rgba(239,68,68,0)",
              ],
            }
          : {}
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
      className={`w-48 h-36 rounded-xl border flex flex-col items-center justify-center
      ${
        attack
          ? "border-red-500 bg-red-500/10"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <Icon
        className={`w-10 h-10 ${
          attack ? "text-red-400" : "text-cyan-400"
        }`}
      />

      <h3 className="mt-3 text-white font-semibold">
        {title}
      </h3>

      <span
        className={`mt-2 px-2 py-1 rounded text-xs font-semibold
        ${
          attack
            ? "bg-red-500/20 text-red-400"
            : "bg-green-500/20 text-green-400"
        }`}
      >
        {attack ? "UNDER ATTACK" : "NORMAL"}
      </span>
    </motion.div>
  );
}

export default function NetworkTopology() {
  const [currentAttack, setCurrentAttack] =
    useState<AttackType>("Normal");

  return (
    <div className="space-y-6">

      <div className="glass-panel rounded-xl p-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-white">
              Vehicle Network Topology
            </h1>

            <p className="text-slate-400 mt-1">
              Real-time ECU Monitoring
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setCurrentAttack("DoS")}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
            >
              DoS
            </button>

            <button
              onClick={() => setCurrentAttack("RPM")}
              className="px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700"
            >
              RPM
            </button>

            <button
              onClick={() => setCurrentAttack("Gear")}
              className="px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700"
            >
              Gear
            </button>

            <button
              onClick={() => setCurrentAttack("Steering")}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Steering
            </button>

            <button
              onClick={() => setCurrentAttack("Normal")}
              className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700"
            >
              Reset
            </button>

          </div>

        </div>

      </div>

     <div className="glass-panel rounded-xl h-[650px] relative overflow-hidden">

  {/* Car Body */}
  <div className="absolute inset-0 flex items-center justify-center">

    <svg
      width="900"
      height="620"
      viewBox="0 0 900 620"
      className="absolute"
    >

      {/* Outer Body */}

      <rect
        x="290"
        y="70"
        width="320"
        height="480"
        rx="150"
        fill="#111827"
        stroke="#2563eb"
        strokeWidth="3"
      />

      {/* Cabin */}

      <rect
        x="340"
        y="130"
        width="220"
        height="360"
        rx="90"
        fill="#172033"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Front Glass */}

      <rect
        x="365"
        y="155"
        width="170"
        height="110"
        rx="25"
        fill="#23314d"
      />

      {/* Rear Glass */}

      <rect
        x="365"
        y="355"
        width="170"
        height="110"
        rx="25"
        fill="#23314d"
      />

      {/* Wheels */}

      <rect
        x="260"
        y="150"
        width="22"
        height="90"
        rx="8"
        fill="#374151"
      />

      <rect
        x="260"
        y="380"
        width="22"
        height="90"
        rx="8"
        fill="#374151"
      />

      <rect
        x="618"
        y="150"
        width="22"
        height="90"
        rx="8"
        fill="#374151"
      />

      <rect
        x="618"
        y="380"
        width="22"
        height="90"
        rx="8"
        fill="#374151"
      />

    </svg>

  </div>

  {/* Gateway */}

  <div className="absolute left-1/2 -translate-x-1/2 top-8">

    <ECUNode
      title="Gateway ECU"
      icon={Router}
      attack={currentAttack === "DoS"}
    />

  </div>

  {/* Engine */}

  <div className="absolute left-[35%] top-[170px]">

    <ECUNode
      title="Engine ECU"
      icon={Cpu}
      attack={currentAttack === "RPM"}
    />

  </div>

  {/* ABS */}

  <div className="absolute right-[35%] top-[170px]">

    <ECUNode
      title="ABS ECU"
      icon={ShieldCheck}
    />

  </div>

  <div className="absolute left-[35%] bottom-[50px]">

    <ECUNode
      title="Steering ECU"
      icon={Activity}
      attack={currentAttack === "Steering"}
    />

  </div>
  <div className="absolute right-[35%] bottom-[50px]">

    <ECUNode
      title="Transmission ECU"
      icon={Car}
      attack={currentAttack === "Gear"}
    />

  </div>

</div>

    </div>
  );
}