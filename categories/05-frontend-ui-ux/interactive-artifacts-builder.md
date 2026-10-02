# Skill: Interactive Artifacts & Single-File Prototypes
`id`: `kbcodedev/interactive-artifacts-builder`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building self-contained, interactive, beautiful single-file React/Tailwind/Lucide artifacts, visual calculators, dashboards, or prototypes for live demonstration.
- **Triggers**: UI proof of concept, interactive dashboard demo, data visualization tool, Claude.ai artifact generation.
- **Prerequisites**: React 18+ hooks, Tailwind CSS utility classes, Lucide icon set.

---

## 2. Core Mental Model & Invariant Principles
1. **Self-Contained Completeness**: The artifact must contain all state, mock data, components, and styling within a single standalone file.
2. **Aesthetic Excellence by Default**: Use modern typography, smooth transition animations, micro-interactions, subtle shadows, and crisp data layouts.
3. **Interactive Delight**: Every button, slider, filter, and chart must respond immediately with interactive state changes and clear visual feedback.

---

## 3. High-Signal Execution Workflow

```
[Prototype Idea / Feature Spec]
                │
                ▼
┌───────────────────────────────┐
│ Step 1: Mock Data Generator   │ ── Realistic, structured domain dataset
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 2: Layout & Navigation   │ ── Responsive grid, sidebar/header, container
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 3: Interactive Controls  │ ── Filters, search inputs, tabs, modal dialogs
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 4: Data Visualization    │ ── Charts, metric stat cards, status indicators
└───────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "artifact_type": "SaaS Subscription & MRR Analytics Dashboard",
  "features": ["MRR growth chart", "Churn breakdown table", "Interactive plan tier simulator"],
  "tech": "React + Tailwind + Lucide React"
}
```

### Output Contract
```tsx
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

export default function SaaSAnalyticsArtifact() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers'>('overview');
  const [mrrGrowth, setMrrGrowth] = useState(12); // Percent growth simulator

  const metrics = [
    { title: 'Monthly Recurring Revenue', value: `$${(84200 * (1 + mrrGrowth/100)).toLocaleString()}`, change: `+${mrrGrowth}%`, positive: true, icon: DollarSign },
    { title: 'Active Subscribers', value: '1,420', change: '+8.4%', positive: true, icon: Users },
    { title: 'Customer Churn Rate', value: '1.8%', change: '-0.3%', positive: true, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SaaS Performance Hub</h1>
            <p className="text-slate-400 text-sm">Real-time revenue metrics and projections</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'customers' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm font-medium">{m.title}</span>
                <m.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{m.value}</span>
                <span className="flex items-center text-xs font-semibold text-emerald-400">
                  <ArrowUpRight className="w-4 h-4 mr-0.5" />
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Broken Dependencies**: Importing external libraries not supported in standalone artifact sandboxes.
- ❌ **Static Non-Interactive Views**: Generating pure static HTML without state hooks, sliders, or interactive filters.
- ❌ **Cluttered Unstyled UI**: Omitting padding, margin, or responsive layouts making components cramped on mobile.

---

## 6. Real-World Production Example

```markdown
**Artifact Utility**: Generated an interactive AWS pricing calculator artifact with instant sliders for EC2 instances, S3 storage, and data transfer. Users simulated cloud migrations in browser in real time.
```
