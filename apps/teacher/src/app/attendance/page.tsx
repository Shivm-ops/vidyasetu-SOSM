"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: any; color: string; bg: string }> = {
  PRESENT: { label: "उपस्थित", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  ABSENT: { label: "अनुपस्थित", icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  LATE: { label: "उशिरा", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  HALF_DAY: { label: "अर्धा दिवस", icon: ChevronDown, color: "text-orange-600", bg: "bg-orange-100" },
};

export default function AttendancePage() {
  const { user } = useAuthStore();
  const teacherId = user?.teacher?.id;
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const qc = useQueryClient();

  const { data: sections } = useQuery({
    queryKey: ["teacher-sections", teacherId],
    queryFn: () =>
      api.get(`/teachers/${teacherId}/students`).then((r) => r.data.data),
    enabled: !!teacherId,
  });

  const selectedSectionData = sections?.find((s: any) => s.id === selectedSection);
  const students = selectedSectionData?.enrollments?.map((e: any) => e.student) ?? [];

  // Initialize all students as PRESENT
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    const sectionData = sections?.find((s: any) => s.id === sectionId);
    const initial: Record<string, AttendanceStatus> = {};
    sectionData?.enrollments?.forEach((e: any) => {
      initial[e.student.id] = "PRESENT";
    });
    setAttendance(initial);
  };

  const markAll = (status: AttendanceStatus) => {
    const updated = { ...attendance };
    students.forEach((s: any) => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/attendance/mark", {
        sectionId: selectedSection,
        date: new Date(date).toISOString(),
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      }),
    onSuccess: () => {
      alert("हजेरी यशस्वीरित्या नोंदवली! ✅");
      qc.invalidateQueries({ queryKey: ["teacher-analytics"] });
    },
  });

  const presentCount = Object.values(attendance).filter((s) => s === "PRESENT").length;
  const absentCount = Object.values(attendance).filter((s) => s === "ABSENT").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900 font-marathi">विद्यार्थी हजेरी</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Controls */}
        <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block font-marathi">वर्ग निवडा</label>
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">-- वर्ग निवडा --</option>
                {(sections ?? []).map((s: any) => (
                  <option key={s.id} value={s.id}>
                    इयत्ता {s.classGrade?.grade} - {s.name} ({s._count?.enrollments ?? 0})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">तारीख</label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Quick mark buttons */}
          {students.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => markAll("PRESENT")}
                className="flex-1 rounded-lg bg-green-100 py-2 text-xs font-medium text-green-700 hover:bg-green-200"
              >
                सर्व उपस्थित
              </button>
              <button
                onClick={() => markAll("ABSENT")}
                className="flex-1 rounded-lg bg-red-100 py-2 text-xs font-medium text-red-700 hover:bg-red-200"
              >
                सर्व अनुपस्थित
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        {students.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-xs text-green-600 font-marathi">उपस्थित</p>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-red-600 font-marathi">अनुपस्थित</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-700">{students.length}</p>
              <p className="text-xs text-gray-500 font-marathi">एकूण</p>
            </div>
          </div>
        )}

        {/* Student list */}
        {students.length > 0 && (
          <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            {students.map((student: any, idx: number) => {
              const status = attendance[student.id] ?? "PRESENT";
              const cfg = STATUS_CONFIG[status];
              return (
                <div
                  key={student.id}
                  className={`flex items-center gap-3 px-4 py-3 ${idx !== 0 ? "border-t" : ""}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800 font-marathi">
                      {student.user.firstNameMarathi ?? student.user.firstName}{" "}
                      {student.user.lastNameMarathi ?? student.user.lastName}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((s) => {
                      const c = STATUS_CONFIG[s];
                      return (
                        <button
                          key={s}
                          onClick={() => setAttendance((prev) => ({ ...prev, [student.id]: s }))}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                            status === s
                              ? `${c.bg} ${c.color} ring-2 ring-offset-1 ring-current`
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit */}
        {students.length > 0 && (
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-60 font-marathi"
          >
            {mutation.isPending ? "नोंदवत आहे..." : "हजेरी नोंदवा ✅"}
          </button>
        )}
      </div>
    </div>
  );
}
