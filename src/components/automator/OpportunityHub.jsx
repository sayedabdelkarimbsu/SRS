import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, FileText, Download, RefreshCw, CheckCircle, AlertCircle,
  Clock, Briefcase, Plus, Trash2, Edit, Move, BarChart3
} from "lucide-react";
import toast from "react-hot-toast";

export const OpportunityHub = ({ profile, user }) => {
  const [opportunity, setOpportunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState("analyze");

  const handleAnalyze = async () => {
    if (!opportunity.trim()) {
      toast.error("Please enter an opportunity description");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const matchScore = Math.floor(Math.random() * 40) + 60;
      const strengths = [
        "Strong academic background",
        "Relevant research experience",
        "Technical skills match",
        "Good publication record"
      ];
      const missing = [
        "Industry experience",
        "Project management skills",
        "Specific technical certification"
      ];

      setResult({
        matchScore,
        strengths: strengths.slice(0, Math.floor(Math.random() * 3) + 2),
        missingKeywords: missing.slice(0, Math.floor(Math.random() * 2) + 1),
        coverLetter: `Dear Hiring Team,\n\nI am writing to express my strong interest in this opportunity. With my background in ${profile?.academic?.[0]?.major || "academic"} and experience in ${profile?.experience?.[0]?.jobTitle || "professional"} roles, I am confident in my ability to contribute effectively.\n\nMy research on ${profile?.research?.researchInterests || "various topics"} has prepared me well for the challenges of this role. I look forward to discussing how my skills and experience align with your needs.\n\nSincerely,\n${user?.displayName || "Applicant"}`,
        resumeBullets: [
          "• Successfully delivered multiple research projects",
          "• Published in top-tier academic journals",
          "• Led cross-functional teams to achieve project goals",
          "• Developed innovative solutions to complex problems"
        ]
      });
      
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCoverLetter = () => {
    if (result?.coverLetter) {
      const blob = new Blob([result.coverLetter], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Cover_Letter_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Cover Letter exported!");
    }
  };

  const handleAddOpportunity = () => {
    if (!opportunity.trim()) {
      toast.error("Please enter an opportunity");
      return;
    }
    const newOpp = {
      id: Date.now().toString(),
      title: opportunity.substring(0, 50) + "...",
      company: "Opportunity",
      status: "saved",
      date: new Date().toLocaleDateString(),
      notes: "",
      url: ""
    };
    setOpportunities([newOpp, ...opportunities]);
    setOpportunity("");
    toast.success("Opportunity added!");
  };

  const statuses = [
    { id: "saved", label: "Saved", icon: Clock, color: "text-slate-400" },
    { id: "applied", label: "Applied", icon: Briefcase, color: "text-blue-500" },
    { id: "interviewing", label: "Interviewing", icon: Move, color: "text-yellow-500" },
    { id: "offered", label: "Offered", icon: CheckCircle, color: "text-emerald-500" },
    { id: "rejected", label: "Rejected", icon: AlertCircle, color: "text-red-500" }
  ];

  const getStatusColor = (statusId) => {
    const s = statuses.find(st => st.id === statusId);
    return s ? s.color : "text-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg shadow-purple-500/20">
        <div className="flex items-center gap-3">
          <Sparkles size={28} />
          <div>
            <h2 className="text-xl font-bold">AI Application Automator</h2>
            <p className="text-white/80 text-sm">Paste an opportunity description to get matched</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
        {[
          { id: "analyze", label: "Analyze", icon: BarChart3 },
          { id: "tracker", label: "Tracker", icon: Briefcase }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "analyze" ? (
        <>
          {/* Input */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <textarea
              value={opportunity}
              onChange={(e) => setOpportunity(e.target.value)}
              placeholder="Paste job or scholarship description here..."
              className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl h-36 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 dark:bg-slate-900"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {loading ? "Analyzing..." : "Analyze Opportunity"}
              </button>
              <button
                onClick={handleAddOpportunity}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Add to Tracker
              </button>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Match Score */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Match Score</span>
                    <span className={`text-2xl font-bold ${
                      result.matchScore >= 70 ? "text-emerald-500" : 
                      result.matchScore >= 40 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {result.matchScore}%
                    </span>
                  </div>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill" style={{ width: `${result.matchScore}%` }}></div>
                  </div>
                </div>

                {/* Strengths & Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
                      <CheckCircle size={18} /> Strengths
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-2 mb-3">
                      <AlertCircle size={18} /> Gaps / Missing
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.missingKeywords?.map((m, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-500">!</span> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Generated Documents */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-3">Generated Documents</h4>
                  <div className="space-y-2">
                    <button
                      onClick={handleExportCoverLetter}
                      className="w-full p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-between hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={18} /> Cover Letter
                      </span>
                      <Download size={18} className="text-indigo-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Tracker */
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Briefcase size={48} className="mx-auto mb-2 opacity-50" />
              <p>No opportunities tracked yet</p>
              <p className="text-sm">Analyze and add opportunities from the Analyze tab</p>
            </div>
          ) : (
            <div className="space-y-2">
              {opportunities.map(opp => (
                <div key={opp.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{opp.title}</p>
                    <p className="text-xs text-slate-400">{opp.company}</p>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(opp.status)}`}>
                    {opp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunityHub;
