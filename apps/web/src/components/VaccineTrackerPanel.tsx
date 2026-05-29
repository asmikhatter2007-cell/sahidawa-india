import React, { useState } from "react";
import { vaccineDatabase, VaccineKey } from "../constants/vaccineData";

export default function VaccineTrackerPanel() {
  const [initialDate, setInitialDate] = useState<string>("");
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineKey>("polio");

  const vaccine = vaccineDatabase[selectedVaccine];

  // Safely converts tracking week offsets into an absolute calendar date
  const calculateMilestoneDate = (weeksOffset: number) => {
    if (!initialDate) return null;

    const reference = new Date(initialDate);
    if (isNaN(reference.getTime())) return null; // Fallback validation for edge cases

    const targetDate = new Date(reference.getTime());
    targetDate.setDate(targetDate.getDate() + weeksOffset * 7);

    return targetDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Guard clause if key sync validation fails
  if (!vaccine) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Error: Selected vaccine data configuration could not be found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 mt-4">
      
      {/* Panel Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
          <span>💉</span> SahiDawa Immunization Hub & Tracker
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Interactive schedule engine aligned with the National Immunization guidelines.
        </p>
      </div>

      {/* Control Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Dropdown Selector */}
        <div>
          <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
            Select Target Profile
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white text-gray-800 font-medium"
            value={selectedVaccine}
            onChange={(e) => setSelectedVaccine(e.target.value as VaccineKey)}
          >
            {(Object.keys(vaccineDatabase) as VaccineKey[]).map((key) => (
              <option key={key} value={key}>
                {vaccineDatabase[key]?.disease_name || key}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Context Date Picker */}
        <div>
          <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
            {vaccine.is_relative_to_birth ? "Child's Birth Date" : "First Dose / Pregnancy Date"}
          </label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-700 font-medium"
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
          />
        </div>
      </div>

      {/* Core Biological Data Card */}
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 mb-6">
        <h3 className="text-lg font-bold text-emerald-900">{vaccine.disease_name}</h3>
        <p className="text-sm text-emerald-700 font-semibold mt-0.5">
          {vaccine.vaccine_name} — <span className="italic font-medium">{vaccine.category} Type</span>
        </p>
        <p className="text-xs text-emerald-800/80 mt-2 leading-relaxed bg-white/40 p-2.5 rounded border border-emerald-100/50">
          {vaccine.disease_summary}
        </p>

        <div className="text-xs mt-4 text-gray-600 space-y-1 bg-white/80 p-3 rounded-lg border border-emerald-100/50 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:space-y-0">
          <p><b>Target Groups:</b> {vaccine.target_groups.join(", ")}</p>
          <p><b>Total Doses:</b> {vaccine.total_doses}</p>
          <p><b>Effectiveness Rate:</b> {vaccine.effectiveness}</p>
        </div>
      </div>

      {/* Timeline Tracking Engine */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-700 flex items-center gap-1.5 mb-2">
          <span>📅</span> Projected Immunization Timeline
        </h4>

        {(vaccine.dosing_intervals_weeks || []).map((weeks, index) => {
          const dateString = calculateMilestoneDate(weeks);
          
          // Generates clear target descriptions depending on strict schedule rules
          let scheduleText = "";
          if (vaccine.is_relative_to_birth) {
            scheduleText = weeks === 0 ? "At Birth Milestone Dose" : `At ${weeks} Weeks of Age`;
          } else {
            scheduleText = index === 0 ? "Initial Administration (Base Line)" : `Dose Step ${index + 1} (+${weeks} weeks later)`;
          }

          return (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50/80 transition bg-white"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold shrink-0 shadow-xs">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {scheduleText}
                </p>
                <p className={`text-xs sm:text-sm mt-0.5 ${dateString ? "text-emerald-700 font-semibold" : "text-amber-600 italic font-medium"}`}>
                  {dateString ? `Target Date: ${dateString}` : "⚠️ Select a tracking point base date above to generate target timelines"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Symptoms Monitoring Block */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-yellow-50/40 p-4 rounded-xl border border-yellow-100">
          <h4 className="font-bold text-yellow-800 flex items-center gap-1 text-sm sm:text-base">
            <span>🟢</span> Common Post-Vaccine Effects
          </h4>
          <ul className="list-disc ml-5 text-xs sm:text-sm mt-2 text-yellow-950 space-y-1">
            {(vaccine.side_effects?.common || []).map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50/40 p-4 rounded-xl border border-red-100">
          <h4 className="font-bold text-red-800 flex items-center gap-1 text-sm sm:text-base">
            <span>🛑</span> Severe Reactions (Monitor Closely)
          </h4>
          <ul className="list-disc ml-5 text-xs sm:text-sm mt-2 text-red-950 space-y-1">
            {(vaccine.side_effects?.severe || []).map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Immediate Clinical Action Guidelines */}
      <div className="mt-6 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-700 flex items-center gap-1 text-sm sm:text-base">
          <span>🩹</span> Immediate Aftercare Guidelines
        </h4>
        <p className="text-xs sm:text-sm mt-1.5 text-blue-950 leading-relaxed font-medium">
          {vaccine.aftercare_text}
        </p>
      </div>
    </div>
  );
}