"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, BookOpen, TrendingUp, BarChart3,
  School, AlertTriangle, CheckCircle, Download
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;

  const { data: schoolData } = useQuery({
    queryKey: ["school-dashboard", schoolId],
    queryFn: () =>
      api.get(`/schools/${schoolId}/dashboard`).then((r) => r.data.data),
    enabled: !!schoolId,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["school-analytics", schoolId],
    queryFn: () =>
      api.get(`/analytics/school/${schoolId}`).then((r) => r.data.data),
    enabled: !!schoolId,
  });

  const school = schoolData?.school;
  const snapshot = schoolData?.todaySnapshot;
  const snapshots = analyticsData?.snapshots ?? [];
  const gradeWise = analyticsData?.gradeWise ?? [];

  const attendanceTrend = snapshots.slice(0, 14).reverse().map((s: any) => ({
    date: new Date(s.snapshotDate).toLocaleDateString("mr-IN", { day: "2-digit", month: "short" }),
    उपस्थिती: Math.round(s.avgAttendancePct),
  }));

  const gradeData = gradeWise.map((g: any) => ({
    इयत्ता: `${g.grade}`,
    विद्यार्थी: g._count._all,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-marathi">
              {school?.nameMarathi ?? school?.name}
            </h1>
            <p className="text-sm text-gray-500">
              UDISE: {school?.udiseCode ?? "N/A"} •{" "}
              {school?.district?.name}, Maharashtra
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            अहवाल डाउनलोड करा
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              label: "एकूण विद्यार्थी",
              value: snapshot?.totalStudents ?? school?._count?.users ?? 0,
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
              trend: null,
            },
            {
              label: "आजची उपस्थिती",
              value: `${Math.round(snapshot?.avgAttendancePct ?? 0)}%`,
              icon: CheckCircle,
              color: snapshot?.avgAttendancePct >= 75 ? "text-green-600" : "text-red-600",
              bg: snapshot?.avgAttendancePct >= 75 ? "bg-green-50" : "bg-red-50",
              trend: null,
            },
            {
              label: "आजचे धडे (एकूण)",
              value: snapshot?.lessonsCompleted ?? 0,
              icon: BookOpen,
              color: "text-orange-600",
              bg: "bg-orange-50",
              trend: null,
            },
            {
              label: "सक्रिय विद्यार्थी (७ दिवस)",
              value: snapshot?.activeStudents ?? 0,
              icon: TrendingUp,
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: null,
            },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl bg-white p-4 shadow-sm">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${metric.bg} mb-3`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-marathi">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Attendance Trend */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4 font-marathi">उपस्थिती ट्रेंड (१४ दिवस)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="उपस्थिती"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-white shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4 font-marathi">इयत्तानिहाय विद्यार्थी</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="इयत्ता" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="विद्यार्थी" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Students */}
        {analyticsData?.topStudents?.length > 0 && (
          <div className="rounded-xl bg-white shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 font-marathi mb-4 flex items-center gap-2">
              🏆 शीर्ष विद्यार्थी
            </h3>
            <div className="space-y-2">
              {analyticsData.topStudents.slice(0, 8).map((lp: any, idx: number) => (
                <div
                  key={lp.studentId}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      idx === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : idx === 1
                        ? "bg-gray-300 text-gray-700"
                        : idx === 2
                        ? "bg-orange-300 text-orange-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p className="flex-1 text-sm font-medium text-gray-800 font-marathi">
                    {lp.student.user.firstNameMarathi ?? lp.student.user.firstName}{" "}
                    {lp.student.user.lastNameMarathi ?? lp.student.user.lastName}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-brand-600">{lp.totalPoints}</span>
                    <span className="text-xs text-gray-400">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements */}
        <div className="rounded-xl bg-white shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 font-marathi">घोषणा</h3>
            <a href="/announcements/create" className="text-sm text-brand-500 hover:underline">
              + नवी घोषणा
            </a>
          </div>
          {(schoolData?.recentAnnouncements ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 font-marathi">कोणत्याही घोषणा नाहीत</p>
          ) : (
            <div className="space-y-2">
              {(schoolData?.recentAnnouncements ?? []).map((a: any) => (
                <div key={a.id} className="rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-sm font-medium text-gray-800 font-marathi">
                    {a.titleMarathi ?? a.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString("mr-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phase 3: Intelligence Analytics */}
        <div className="col-span-full mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Vidyasetu V2 Intelligence Analytics
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Weak Concepts */}
            <div className="rounded-xl bg-white shadow-sm p-5 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-4 font-marathi flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                सर्वाधिक कच्चे विषय (Most Weak Concepts)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="font-medium text-gray-800 text-sm">Fractions (अपूर्णांक)</span>
                  <span className="text-red-600 font-bold text-sm">124 Students</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="font-medium text-gray-800 text-sm">Decimals (दशांश)</span>
                  <span className="text-red-600 font-bold text-sm">98 Students</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="font-medium text-gray-800 text-sm">Algebra Basics</span>
                  <span className="text-red-600 font-bold text-sm">75 Students</span>
                </div>
              </div>
            </div>

            {/* Village Performance */}
            <div className="rounded-xl bg-white shadow-sm p-5 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-4 font-marathi flex items-center gap-2">
                <School className="w-4 h-4 text-green-500" />
                गावाची प्रगती (Village Performance)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-medium text-gray-800 text-sm">1. Shirur (शिरूर)</span>
                  <span className="text-green-700 font-bold text-sm">8500 Impact Score</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-medium text-gray-800 text-sm">2. Baramati (बारामती)</span>
                  <span className="text-green-700 font-bold text-sm">7200 Impact Score</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-medium text-gray-800 text-sm">3. Junnar (जुन्नर)</span>
                  <span className="text-green-700 font-bold text-sm">6100 Impact Score</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
