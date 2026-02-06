"use client";
// 👇 1. Yeh line sabse important hai. Isse Build Error hat jayega.
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

// Main Content Component
function HomeContent() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  
  const [showInput, setShowInput] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchMeetings = useCallback(async (emailToUse) => {
    const targetEmail = emailToUse || userEmail;
    setLoading(true);
    try {
      const url = targetEmail ? `${API_URL}/meetings?email=${targetEmail}` : `${API_URL}/meetings`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setMeetings(data);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
    setLoading(false);
  }, [userEmail, API_URL]);

  useEffect(() => {
    const authStatus = searchParams.get("auth");
    const emailFromUrl = searchParams.get("email");

    if (authStatus === "success" && emailFromUrl) {
      setUserEmail(emailFromUrl);
      fetchMeetings(emailFromUrl);
      toast.success("Sync Successful!");
      window.history.replaceState(null, '', '/');
    }
  }, [searchParams, fetchMeetings]);

  const handleLogin = async () => {
    try {
        const res = await fetch(`${API_URL}/auth/url`);
        const { url } = await res.json();
        window.location.href = url;
    } catch (error) {
        toast.error("Backend connection failed");
    }
  };

  const addManualMeeting = () => {
    if (!customTitle.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    const newMeeting = {
      id: `manual-${Date.now()}`,
      title: customTitle,
      startTime: new Date().toISOString(),
      description: "Manual Entry"
    };
    setMeetings([newMeeting, ...meetings]);
    setCustomTitle("");
    setShowInput(false);
    toast.success("Meeting Added manually");
  };

  const generateReport = async (meeting) => {
    setSelectedMeeting(meeting);
    setReport(null);
    setAnalyzing(true);
    
    const loadingToast = toast.loading(`Researching ${meeting.title}...`);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: meeting.title }),
      });
      const data = await res.json();
      setReport(data);
      toast.success("Research Complete!", { id: loadingToast });
    } catch (err) {
      toast.error("Analysis failed. Check Backend.", { id: loadingToast });
    }
    setAnalyzing(false);
  };

  const handleEmailSend = async () => {
    if (!report) return;
    const emailInput = prompt("Enter email:", userEmail || ""); 
    if (!emailInput) return;

    setEmailSending(true);
    const toastId = toast.loading("Sending Email...");

    try {
      const res = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, report: report }),
      });
      
      if (res.ok) {
        toast.success(`Email sent to ${emailInput} 🚀`, { id: toastId });
      } else {
        toast.error("Failed to send email ❌", { id: toastId });
      }
    } catch (err) {
      toast.error("Network Error ⚠️", { id: toastId });
    }
    setEmailSending(false);
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    setPdfDownloading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('report-content');
      const opt = {
        margin:       [0.5, 0.5],
        filename:     `Meeting_Prep_${report.prospectName.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF Downloaded! 📄", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("PDF Generation Failed", { id: toastId });
    }
    setPdfDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-700 pb-4 gap-4">
        <div>
           <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Anapan AI Sales Agent
          </h1>
          <p className="text-xs text-gray-400 mt-1">Automated Research & Meeting Prep</p>
        </div>
       
        <div className="flex gap-3">
            <button onClick={handleLogin} className="text-xs text-gray-400 hover:text-white underline">
              {userEmail ? `Synced as: ${userEmail}` : "Sync Calendar (Dev Mode)"}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 bg-gray-800 rounded-xl p-4 flex flex-col h-full border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-200">📅 Schedule</h2>
            <button onClick={() => setShowInput(!showInput)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition shadow-lg">
                + Add Meeting
            </button>
          </div>

          {showInput && (
              <div className="mb-4 bg-gray-700 p-3 rounded-lg animate-fade-in border border-gray-600">
                  <input 
                    type="text" placeholder="Ex: Discussion with Elon Musk from Tesla"
                    className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 text-sm mb-2 focus:border-blue-500 outline-none"
                    value={customTitle} onChange={(e) => setCustomTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addManualMeeting()}
                  />
                  <button onClick={addManualMeeting} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded text-sm">Analyze 🚀</button>
              </div>
          )}
          
          <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
            {meetings.length === 0 && !loading && !showInput && (
                <div className="text-center py-10 opacity-50">
                    <p>No meetings found.</p>
                </div>
            )}
            {meetings.map((m) => (
              <div key={m.id} onClick={() => generateReport(m)}
                className={`p-3 rounded-lg cursor-pointer transition border-l-4 ${
                  selectedMeeting?.id === m.id ? "bg-gray-700 border-blue-500 shadow-md" : "bg-gray-700/30 border-transparent hover:bg-gray-700"
                }`}
              >
                <h3 className="font-bold text-sm truncate text-gray-200">{m.title}</h3>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-gray-400">{new Date(m.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    {m.id.startsWith('manual') && <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1 rounded">MANUAL</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 bg-gray-800/50 rounded-xl p-6 h-full overflow-hidden flex flex-col justify-center relative">
          
          {!selectedMeeting ? (
             <div className="text-center text-gray-500">
               <div className="text-6xl mb-4 opacity-30">📄</div>
               <p>Select a meeting to view the Briefing Document</p>
             </div>
          ) : analyzing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
              <p className="text-blue-400 animate-pulse font-mono text-sm">Running Intelligence Agent...</p>
            </div>
          ) : report ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-end gap-3 mb-4">
                <button onClick={handleEmailSend} disabled={emailSending} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition border border-gray-600">
                  {emailSending ? "Sending..." : "✉️ Email"}
                </button>
                <button onClick={handleDownloadPDF} disabled={pdfDownloading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm transition shadow-lg text-white">
                  {pdfDownloading ? "Generating PDF..." : "⬇️ Download PDF"}
                </button>
              </div>

              {/* Document Content */}
              <div className="overflow-y-auto flex-1 custom-scrollbar p-2 bg-gray-900/50 rounded-lg">
                <div 
                  id="report-content" 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#000000', 
                    padding: '40px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                  className="rounded-sm shadow-2xl max-w-3xl mx-auto min-h-[800px]"
                >
                  <div style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111', textTransform: 'uppercase', margin: 0 }}>Meeting Brief</h1>
                      <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Prepared by Anapan AI</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{report.prospectName}</h2>
                      <p style={{ color: '#444', fontWeight: '500', margin: '2px 0' }}>{report.role}</p>
                      <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{report.company}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div style={{ backgroundColor: '#fef2f2', padding: '20px', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
                      <h3 style={{ color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '10px' }}>
                        🔥 Critical Pain Points
                      </h3>
                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {report.painPoints?.map((p, i) => (
                          <li key={i} style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#111', display: 'block', fontSize: '14px' }}>{p.title}</strong>
                            <span style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>{p.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '4px', borderLeft: '4px solid #22c55e' }}>
                      <h3 style={{ color: '#166534', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '10px' }}>
                        💡 Strategic Talking Points
                      </h3>
                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {report.talkingPoints?.map((t, i) => (
                          <li key={i} style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#111', display: 'block', fontSize: '14px' }}>{t.title}</strong>
                            <span style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>{t.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                      <h3 style={{ color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '10px' }}>Execution Tips</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {report.tips?.map((tip, i) => (
                          <div key={i} style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '4px', fontSize: '14px', color: '#374151', display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>Confidential • Generated for Internal Use Only</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-red-400">Analysis Error</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrapper Component ki zaroorat nahi ab, direct export default Home kar diya hai.
// Kyunki `force-dynamic` use kar liya.
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading App...</div>}>
      <HomeContent />
    </Suspense>
  );
}