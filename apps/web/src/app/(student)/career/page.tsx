"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, ChevronRight, Star, Trophy, BookOpen,
  Briefcase, Heart, Calculator, Leaf, Users, FlaskConical,
  Plane, Shield, TrendingUp, Music, Pencil, Cpu, Globe,
  Target, CheckCircle2, Lock, Award, GraduationCap, DollarSign,
  Zap, BarChart3, Map, X, Search,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

interface Career {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  icon: React.ElementType;
  category: string;
  gradient: string;
  accent: string;
  match?: number;
  salary: string;
  demand: "high" | "medium" | "growing";
  subjects: string[];
  skills: string[];
  exams: string[];
  colleges: string[];
  opportunities: string[];
  scholarships: string[];
  roadmap: { label: string; desc: string; icon: React.ElementType }[];
  desc: string;
  tags: string[];
}

const CAREERS: Career[] = [
  {
    id: "doctor",
    title: "डॉक्टर", titleEn: "Doctor / Physician", emoji: "🩺",
    icon: Heart, category: "आरोग्य",
    gradient: "from-rose-500 to-pink-600", accent: "#f43f5e",
    salary: "₹6L–₹25L+", demand: "high",
    desc: "रुग्णांवर उपचार करणे, आजार ओळखणे आणि सार्वजनिक आरोग्य सेवा देणे.",
    tags: ["विज्ञान", "जीवशास्त्र", "समाजसेवा"],
    subjects: ["जीवशास्त्र", "रसायनशास्त्र", "भौतिकशास्त्र", "इंग्रजी"],
    skills: ["रुग्ण संवाद", "विश्लेषण", "संयम", "नेतृत्व"],
    exams: ["NEET UG", "NEET PG", "USMLE (परदेश)"],
    colleges: ["AIIMS", "सरकारी मेडिकल कॉलेज", "KEM मुंबई", "ससून पुणे"],
    opportunities: ["सरकारी हॉस्पिटल", "खाजगी दवाखाना", "NGO", "संशोधन"],
    scholarships: ["PM Scholarship", "NSP Scholarship", "Rajiv Gandhi"],
    roadmap: [
      { label: "10वी — विज्ञान शाखा", desc: "PCB विषय घ्या", icon: BookOpen },
      { label: "12वी — PCB", desc: "NEET तयारी सुरू करा", icon: FlaskConical },
      { label: "NEET UG परीक्षा", desc: "प्रवेश परीक्षा उत्तीर्ण करा", icon: Trophy },
      { label: "MBBS (5.5 वर्षे)", desc: "मेडिकल कॉलेज", icon: GraduationCap },
      { label: "Internship (1 वर्ष)", desc: "हॉस्पिटलमध्ये प्रशिक्षण", icon: Briefcase },
      { label: "MD/MS Specialization", desc: "विशेषज्ञ होणे", icon: Award },
    ],
  },
  {
    id: "engineer",
    title: "अभियंता", titleEn: "Engineer", emoji: "⚙️",
    icon: Cpu, category: "तंत्रज्ञान",
    gradient: "from-blue-500 to-indigo-600", accent: "#3b82f6",
    salary: "₹4L–₹40L+", demand: "high",
    desc: "तंत्रज्ञान, इमारती, सॉफ्टवेअर, यंत्रे यांची रचना, निर्माण आणि देखभाल.",
    tags: ["गणित", "विज्ञान", "तंत्रज्ञान"],
    subjects: ["गणित", "भौतिकशास्त्र", "रसायनशास्त्र", "संगणक"],
    skills: ["समस्यानिवारण", "गणितीय विचार", "सर्जनशीलता", "टीमवर्क"],
    exams: ["JEE Main", "JEE Advanced", "MHT-CET", "GATE"],
    colleges: ["IIT", "NIT", "VJTI मुंबई", "COEP पुणे", "सरकारी इंजीनियरिंग"],
    opportunities: ["TCS, Infosys, Wipro", "ISRO, DRDO", "स्वतःचा व्यवसाय", "परदेश"],
    scholarships: ["AICTE Scholarship", "Inspire Award", "PM-YASASVI"],
    roadmap: [
      { label: "10वी — विज्ञान-गणित", desc: "PCM विषय निवडा", icon: BookOpen },
      { label: "12वी — PCM", desc: "JEE/MHT-CET तयारी", icon: Calculator },
      { label: "JEE / MHT-CET", desc: "प्रवेश परीक्षा", icon: Trophy },
      { label: "B.Tech / B.E. (4 वर्षे)", desc: "शाखा निवडा: CS, Mech, Civil...", icon: GraduationCap },
      { label: "Internship + Campus", desc: "कंपन्यांमध्ये प्रशिक्षण", icon: Briefcase },
      { label: "M.Tech / MBA / Startup", desc: "पुढील करिअर संधी", icon: TrendingUp },
    ],
  },
  {
    id: "agri-officer",
    title: "कृषी अधिकारी", titleEn: "Agriculture Officer", emoji: "🌾",
    icon: Leaf, category: "कृषी",
    gradient: "from-green-500 to-emerald-600", accent: "#22c55e",
    salary: "₹3.5L–₹12L", demand: "growing",
    desc: "शेती विकास, कृषी तंत्रज्ञान, शेतकरी मार्गदर्शन आणि सरकारी योजना राबवणे.",
    tags: ["विज्ञान", "शेती", "ग्रामविकास"],
    subjects: ["जीवशास्त्र", "रसायनशास्त्र", "विज्ञान", "भूगोल"],
    skills: ["शेती ज्ञान", "नेतृत्व", "संवाद", "विश्लेषण"],
    exams: ["MPSC Agri", "IBPS AFO", "FCI", "AO Exam"],
    colleges: ["MPKV राहुरी", "VNMKV परभणी", "PDKV अकोला", "MAU औरंगाबाद"],
    opportunities: ["MPSC Agricultural Officer", "बँक AFO", "NGO", "स्वतःची शेती"],
    scholarships: ["ICAR Scholarship", "PM-KISAN Education", "State Agri Scholarship"],
    roadmap: [
      { label: "10वी — विज्ञान शाखा", desc: "Biology/Agri विषय घ्या", icon: BookOpen },
      { label: "12वी — PCB/Agri", desc: "कृषी अभ्यास", icon: Leaf },
      { label: "B.Sc Agriculture (4 वर्षे)", desc: "कृषी विद्यापीठात प्रवेश", icon: GraduationCap },
      { label: "MPSC / IBPS AFO", desc: "सरकारी परीक्षा", icon: Trophy },
      { label: "Agricultural Officer", desc: "जिल्हा कृषी कार्यालय", icon: Briefcase },
      { label: "वरिष्ठ पद / संशोधन", desc: "PhD / वरिष्ठ अधिकारी", icon: Award },
    ],
  },
  {
    id: "teacher",
    title: "शिक्षक", titleEn: "Teacher / Professor", emoji: "📚",
    icon: BookOpen, category: "शिक्षण",
    gradient: "from-amber-500 to-orange-600", accent: "#f59e0b",
    salary: "₹2.5L–₹10L", demand: "high",
    desc: "विद्यार्थ्यांना ज्ञान देणे, प्रेरणा देणे आणि समाजाला शिक्षित करणे.",
    tags: ["मराठी", "विषय ज्ञान", "समाजसेवा"],
    subjects: ["कोणताही मुख्य विषय", "शिक्षणशास्त्र", "मराठी/इंग्रजी"],
    skills: ["संवाद", "संयम", "विषयज्ञान", "डिजिटल शिक्षण"],
    exams: ["TET", "CTET", "SET", "NET"],
    colleges: ["B.Ed कॉलेज", "D.T.Ed", "TISS", "M.Ed विद्यापीठ"],
    opportunities: ["ZP शाळा", "खाजगी शाळा", "महाविद्यालय प्राध्यापक", "ऑनलाइन शिक्षण"],
    scholarships: ["NMMS Scholarship", "NSP Teaching", "INSPIRE Faculty"],
    roadmap: [
      { label: "10वी + 12वी", desc: "कोणत्याही शाखेतून", icon: BookOpen },
      { label: "Bachelor's Degree", desc: "BA/BSc/BCom — विषय निवडा", icon: GraduationCap },
      { label: "B.Ed / D.T.Ed", desc: "शिक्षण प्रशिक्षण", icon: Award },
      { label: "TET / CTET परीक्षा", desc: "शिक्षक पात्रता चाचणी", icon: Trophy },
      { label: "शिक्षक म्हणून नियुक्ती", desc: "ZP / खाजगी शाळा", icon: Briefcase },
      { label: "NET/SET → प्राध्यापक", desc: "महाविद्यालयात संधी", icon: Star },
    ],
  },
  {
    id: "ca",
    title: "चार्टर्ड अकाउंटंट", titleEn: "CA / Chartered Accountant", emoji: "💼",
    icon: DollarSign, category: "वित्त",
    gradient: "from-yellow-500 to-amber-600", accent: "#eab308",
    salary: "₹6L–₹30L+", demand: "high",
    desc: "व्यवसायांचे हिशेब, करनियोजन, लेखापरीक्षण आणि आर्थिक सल्ला देणे.",
    tags: ["गणित", "वित्त", "व्यवसाय"],
    subjects: ["गणित", "अर्थशास्त्र", "वाणिज्य", "इंग्रजी"],
    skills: ["संख्यात्मक विश्लेषण", "कायदा ज्ञान", "नैतिकता", "लक्ष"],
    exams: ["CA Foundation", "CA Intermediate", "CA Final"],
    colleges: ["ICAI (संस्था)", "वाणिज्य महाविद्यालय", "B.Com"],
    opportunities: ["CA फर्म", "MNC Finance", "स्वतंत्र सल्लागार", "CFO"],
    scholarships: ["ICAI Scholarship", "Merit Scholarship", "NSP"],
    roadmap: [
      { label: "10वी", desc: "गणित + इंग्रजी चांगले असणे", icon: BookOpen },
      { label: "12वी — वाणिज्य", desc: "Commerce शाखा", icon: Calculator },
      { label: "CA Foundation", desc: "ICAI नोंदणी + परीक्षा", icon: Trophy },
      { label: "CA Intermediate", desc: "2 गट परीक्षा + Articleship", icon: Award },
      { label: "CA Final", desc: "अंतिम परीक्षा उत्तीर्ण", icon: Star },
      { label: "CA म्हणून प्रॅक्टिस", desc: "स्वतंत्र / कंपनीत", icon: Briefcase },
    ],
  },
  {
    id: "police",
    title: "पोलीस अधिकारी", titleEn: "Police Officer / IPS", emoji: "🛡️",
    icon: Shield, category: "सेवा",
    gradient: "from-slate-600 to-gray-700", accent: "#64748b",
    salary: "₹3L–₹15L+", demand: "medium",
    desc: "समाजाची सुरक्षा, कायदा व्यवस्था राखणे आणि न्याय प्रदान करणे.",
    tags: ["शारीरिक", "नेतृत्व", "समाजसेवा"],
    subjects: ["इतिहास", "भूगोल", "राज्यशास्त्र", "मराठी/इंग्रजी"],
    skills: ["शारीरिक क्षमता", "निर्णयक्षमता", "नेतृत्व", "संवाद"],
    exams: ["MPSC PSI/STI", "UPSC IPS", "Maharashtra Police Bharti"],
    colleges: ["कोणत्याही शाखेतून पदवी", "Police Training Academy"],
    opportunities: ["राज्य पोलीस", "IPS", "CRPF", "Intelligence Bureau"],
    scholarships: ["Ex-Servicemen Scholarship", "NSP", "State Scholarship"],
    roadmap: [
      { label: "10वी + 12वी", desc: "कोणत्याही शाखेतून", icon: BookOpen },
      { label: "पदवी (कोणतीही)", desc: "Graduation आवश्यक", icon: GraduationCap },
      { label: "शारीरिक तंदुरुस्ती", desc: "नियमित व्यायाम + तयारी", icon: Zap },
      { label: "MPSC PSI / Police Bharti", desc: "राज्य परीक्षा", icon: Trophy },
      { label: "पोलीस प्रशिक्षण", desc: "Academy Training", icon: Award },
      { label: "पोलीस अधिकारी", desc: "पदोन्नती / IPS", icon: Shield },
    ],
  },
  {
    id: "entrepreneur",
    title: "उद्योजक", titleEn: "Entrepreneur / Startup", emoji: "🚀",
    icon: TrendingUp, category: "व्यवसाय",
    gradient: "from-violet-500 to-purple-600", accent: "#8b5cf6",
    salary: "₹0–कोटी!", demand: "growing",
    desc: "स्वतःचा व्यवसाय सुरू करणे, नवीन उत्पादन/सेवा बाजारात आणणे आणि रोजगार निर्माण करणे.",
    tags: ["सर्जनशीलता", "नेतृत्व", "धाडस"],
    subjects: ["व्यवस्थापन", "अर्थशास्त्र", "तंत्रज्ञान", "मार्केटिंग"],
    skills: ["नेतृत्व", "जोखीम स्वीकार", "नवोन्मेष", "विक्री कौशल्य"],
    exams: ["MBA (CAT/MAH-CET)", "Startup India नोंदणी"],
    colleges: ["IIM", "SIBM पुणे", "NMIMS", "कोणत्याही विद्यापीठातून"],
    opportunities: ["Tech Startup", "Agri Business", "Social Enterprise", "Export"],
    scholarships: ["Startup India Seed Fund", "MSME Loan", "AIC Innovation"],
    roadmap: [
      { label: "10वी + 12वी", desc: "कोणत्याही शाखेतून", icon: BookOpen },
      { label: "कल्पना ओळखा", desc: "समस्या शोधा, उपाय सुचवा", icon: Zap },
      { label: "Skills शिका", desc: "Digital, Marketing, Finance", icon: Award },
      { label: "Prototype / MVP", desc: "लहान स्तरावर सुरुवात करा", icon: FlaskConical },
      { label: "Startup नोंदणी", desc: "Startup India + GST", icon: Briefcase },
      { label: "Scale Up", desc: "Investment + Expansion", icon: TrendingUp },
    ],
  },
  {
    id: "scientist",
    title: "शास्त्रज्ञ", titleEn: "Scientist / Researcher", emoji: "🔬",
    icon: FlaskConical, category: "संशोधन",
    gradient: "from-cyan-500 to-teal-600", accent: "#06b6d4",
    salary: "₹4L–₹20L+", demand: "growing",
    desc: "नवीन शोध लावणे, प्रयोग करणे, ISRO/DRDO/BARC मध्ये भारताच्या प्रगतीत योगदान देणे.",
    tags: ["विज्ञान", "गणित", "संशोधन"],
    subjects: ["भौतिकशास्त्र", "रसायनशास्त्र", "जीवशास्त्र", "गणित"],
    skills: ["विश्लेषण", "संशोधन", "संयम", "गणित"],
    exams: ["IIT JEE", "IISER Aptitude", "JEST", "CSIR NET"],
    colleges: ["IISc बंगळूर", "IISER", "IIT", "TIFR"],
    opportunities: ["ISRO", "DRDO", "BARC", "Pharma R&D", "विद्यापीठ"],
    scholarships: ["INSPIRE Scholarship", "KVPY", "DST Fellowship", "CSIR JRF"],
    roadmap: [
      { label: "10वी — PCM/PCB", desc: "विज्ञान विषय निवडा", icon: BookOpen },
      { label: "12वी — उत्कृष्ट गुण", desc: "Olympiad/KVPY तयारी", icon: Star },
      { label: "BSc/IISER/IIT (3-4 वर्षे)", desc: "विज्ञान पदवी", icon: GraduationCap },
      { label: "MSc/PhD (2-5 वर्षे)", desc: "संशोधन प्रशिक्षण", icon: FlaskConical },
      { label: "Postdoc / Scientist", desc: "ISRO/DRDO/Pharma", icon: Briefcase },
      { label: "Senior Scientist / Fellow", desc: "शोधाचे नेतृत्व", icon: Award },
    ],
  },
  {
    id: "pilot",
    title: "वैमानिक", titleEn: "Pilot", emoji: "✈️",
    icon: Plane, category: "विमानसेवा",
    gradient: "from-sky-500 to-blue-600", accent: "#0ea5e9",
    salary: "₹12L–₹60L+", demand: "growing",
    desc: "व्यावसायिक विमाने उडवणे, प्रवासी वाहतूक आणि कार्गो सेवा प्रदान करणे.",
    tags: ["गणित", "विज्ञान", "साहस"],
    subjects: ["गणित", "भौतिकशास्त्र", "इंग्रजी"],
    skills: ["लक्ष", "निर्णयक्षमता", "शारीरिक तंदुरुस्ती", "इंग्रजी"],
    exams: ["DGCA CPL Exam", "NDA (Air Force)", "Air India Selection"],
    colleges: ["Indira Gandhi RPTC", "Bombay Flying Club", "CAE Oxford", "Ahmedabad Aviation"],
    opportunities: ["IndiGo", "Air India", "SpiceJet", "Air Force"],
    scholarships: ["AAI Scholarship", "Rajiv Gandhi AASF", "State Aviation Scholarship"],
    roadmap: [
      { label: "10वी — PCM", desc: "गणित + भौतिकशास्त्र आवश्यक", icon: BookOpen },
      { label: "12वी — PCM उत्तीर्ण", desc: "50%+ गुण आवश्यक", icon: Calculator },
      { label: "Medical Fitness", desc: "DGCA Class 1 Medical", icon: Heart },
      { label: "CPL Training (200+ तास)", desc: "Flying School", icon: Plane },
      { label: "DGCA परीक्षा", desc: "CPL License मिळवा", icon: Trophy },
      { label: "Commercial Pilot", desc: "Airline First Officer", icon: Award },
    ],
  },
  {
    id: "banker",
    title: "बँकर", titleEn: "Banker / Finance Professional", emoji: "🏦",
    icon: BarChart3, category: "वित्त",
    gradient: "from-emerald-500 to-green-600", accent: "#10b981",
    salary: "₹3L–₹18L", demand: "high",
    desc: "बँकेत ग्राहकांना वित्तीय सेवा, कर्ज, गुंतवणूक सल्ला आणि व्यवस्थापन.",
    tags: ["गणित", "वित्त", "संवाद"],
    subjects: ["गणित", "अर्थशास्त्र", "वाणिज्य", "इंग्रजी"],
    skills: ["संख्यात्मक", "ग्राहक सेवा", "विश्वसनीयता", "इंग्रजी"],
    exams: ["IBPS PO/Clerk", "SBI PO", "RBI Grade B", "NABARD"],
    colleges: ["B.Com", "BBA", "MBA Finance", "वाणिज्य महाविद्यालय"],
    opportunities: ["SBI", "Bank of Maharashtra", "HDFC", "RBI", "NABARD"],
    scholarships: ["NABARD Rural Scholarship", "Bank Scholarship", "NSP"],
    roadmap: [
      { label: "10वी + 12वी", desc: "वाणिज्य शाखा उत्तम", icon: BookOpen },
      { label: "B.Com / BBA (3 वर्षे)", desc: "वित्त विषय शिका", icon: GraduationCap },
      { label: "IBPS/SBI तयारी", desc: "बँकिंग परीक्षा", icon: Trophy },
      { label: "Probationary Officer", desc: "बँकेत नोकरी", icon: Briefcase },
      { label: "Branch Manager", desc: "पदोन्नती / MBA", icon: BarChart3 },
      { label: "General Manager / GM", desc: "वरिष्ठ व्यवस्थापक", icon: Award },
    ],
  },
  {
    id: "artist",
    title: "कलाकार / डिझायनर", titleEn: "Artist / Designer", emoji: "🎨",
    icon: Pencil, category: "कला",
    gradient: "from-fuchsia-500 to-pink-600", accent: "#d946ef",
    salary: "₹2L–₹20L+", demand: "growing",
    desc: "ग्राफिक डिझाइन, अॅनिमेशन, चित्रकला, फोटोग्राफी — सर्जनशील क्षेत्रात करिअर.",
    tags: ["सर्जनशीलता", "कला", "तंत्रज्ञान"],
    subjects: ["कला/Drawing", "Digital Tools", "इतिहास"],
    skills: ["सर्जनशीलता", "Adobe Tools", "3D Design", "Portfolio"],
    exams: ["NID Entrance", "NIFT Entrance", "MIT ADT", "Symbiosis"],
    colleges: ["NID अहमदाबाद", "NIFT मुंबई", "MIT ADT पुणे", "Sir JJ School of Art"],
    opportunities: ["Graphic Studio", "Animation", "Film Industry", "Freelance"],
    scholarships: ["NID Scholarship", "NIFT Merit", "State Art Scholarship"],
    roadmap: [
      { label: "10वी + 12वी", desc: "कोणत्याही शाखेतून (कला उत्तम)", icon: BookOpen },
      { label: "Portfolio तयार करा", desc: "स्वतःचे काम दाखवा", icon: Pencil },
      { label: "NID/NIFT Entrance", desc: "डिझाइन संस्था प्रवेश", icon: Trophy },
      { label: "B.Des / BFA (4 वर्षे)", desc: "व्यावसायिक शिक्षण", icon: GraduationCap },
      { label: "Internship / Freelance", desc: "प्रत्यक्ष काम", icon: Briefcase },
      { label: "Senior Designer / Studio", desc: "स्वतःचा व्यवसाय / MNC", icon: Award },
    ],
  },
  {
    id: "software",
    title: "सॉफ्टवेअर इंजीनियर", titleEn: "Software Engineer", emoji: "💻",
    icon: Cpu, category: "तंत्रज्ञान",
    gradient: "from-indigo-500 to-violet-600", accent: "#6366f1",
    salary: "₹5L–₹60L+", demand: "high",
    desc: "Apps, Websites, AI systems तयार करणे आणि जगातील सर्वात मोठ्या Tech कंपन्यांमध्ये काम करणे.",
    tags: ["गणित", "तंत्रज्ञान", "Programming"],
    subjects: ["गणित", "संगणकशास्त्र", "भौतिकशास्त्र", "इंग्रजी"],
    skills: ["Coding", "Problem Solving", "Git", "Cloud"],
    exams: ["JEE Main", "MHT-CET", "GATE", "Campus Placement"],
    colleges: ["IIT", "NIT", "COEP", "VJTI", "Pune University"],
    opportunities: ["Google", "Microsoft", "TCS", "Startup", "Freelance"],
    scholarships: ["AICTE Scholarship", "Google Scholarship", "Microsoft TEALS"],
    roadmap: [
      { label: "10वी — PCM", desc: "गणित उत्कृष्ट असणे", icon: BookOpen },
      { label: "12वी — PCM/CS", desc: "Computer Science घ्या", icon: Cpu },
      { label: "B.Tech CS (4 वर्षे)", desc: "JEE/MHT-CET", icon: GraduationCap },
      { label: "Coding + Projects", desc: "GitHub, Hackathons", icon: Zap },
      { label: "Campus Placement", desc: "MNC / Startup", icon: Briefcase },
      { label: "Senior Engineer / Lead", desc: "₹30L+ / Startup CTO", icon: TrendingUp },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// QUIZ DATA
// ─────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    id: "subjects",
    question: "तुम्हाला कोणते विषय जास्त आवडतात?",
    emoji: "📚",
    options: [
      { label: "विज्ञान (Biology, Chemistry)", value: "science", tags: ["science", "biology"] },
      { label: "गणित आणि भौतिकशास्त्र", value: "math", tags: ["math", "physics"] },
      { label: "वाणिज्य आणि अर्थशास्त्र", value: "commerce", tags: ["commerce", "finance"] },
      { label: "कला, साहित्य, इतिहास", value: "arts", tags: ["arts", "language"] },
    ],
  },
  {
    id: "activities",
    question: "तुम्हाला कोणत्या गोष्टी करायला आवडतात?",
    emoji: "🎯",
    options: [
      { label: "🔬 प्रयोग करणे आणि शोध लावणे", value: "research", tags: ["research", "science"] },
      { label: "💻 संगणक / गेम्स / Coding", value: "tech", tags: ["tech", "computer"] },
      { label: "🌱 शेती, निसर्ग, प्राणी", value: "nature", tags: ["nature", "agriculture"] },
      { label: "🎨 चित्र काढणे / संगीत / नृत्य", value: "creative", tags: ["creative", "arts"] },
    ],
  },
  {
    id: "people",
    question: "लोकांसोबत काम करायला आवडते का?",
    emoji: "🤝",
    options: [
      { label: "हो! मला लोकांना मदत करायला आवडते", value: "helping", tags: ["people", "service"] },
      { label: "हो! मला नेतृत्व करायला आवडते", value: "leading", tags: ["leadership", "management"] },
      { label: "थोडे — मला एकट्याने काम आवडते", value: "independent", tags: ["independent", "research"] },
      { label: "नाही — मला तंत्रज्ञान / यंत्रे आवडतात", value: "machines", tags: ["tech", "engineering"] },
    ],
  },
  {
    id: "environment",
    question: "तुम्हाला कोणत्या वातावरणात काम करायला आवडेल?",
    emoji: "🏢",
    options: [
      { label: "🏥 हॉस्पिटल / सेवा केंद्र", value: "hospital", tags: ["health", "service"] },
      { label: "🌾 शेत / जंगल / बाहेर", value: "outdoor", tags: ["outdoor", "agriculture"] },
      { label: "💼 ऑफिस / कंपनी", value: "office", tags: ["office", "corporate"] },
      { label: "🏠 घरातून / स्वतंत्र", value: "remote", tags: ["independent", "creative"] },
    ],
  },
  {
    id: "goal",
    question: "तुमचे मुख्य उद्दिष्ट काय आहे?",
    emoji: "🚀",
    options: [
      { label: "🌟 जास्तीत जास्त पैसे कमवणे", value: "money", tags: ["finance", "tech"] },
      { label: "❤️ समाजाची सेवा करणे", value: "service", tags: ["service", "teaching"] },
      { label: "🔬 नवीन शोध / संशोधन", value: "research", tags: ["research", "science"] },
      { label: "🏆 सरकारी पद / स्थिरता", value: "stability", tags: ["government", "service"] },
    ],
  },
];

// Career match scoring
function calculateCareerMatches(answers: Record<string, string>): Record<string, number> {
  const tagCounts: Record<string, number> = {};

  Object.values(answers).forEach(answerValue => {
    QUIZ_QUESTIONS.forEach(q => {
      const opt = q.options.find(o => o.value === answerValue);
      if (opt) {
        opt.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
  });

  const careerScores: Record<string, number> = {};

  CAREERS.forEach(career => {
    let score = 30; // base
    career.tags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      Object.keys(tagCounts).forEach(t => {
        if (tagLower.includes(t) || t.includes(tagLower)) {
          score += tagCounts[t] * 15;
        }
      });
    });
    careerScores[career.id] = Math.min(98, Math.max(30, score));
  });

  return careerScores;
}

function getDNAProfile(answers: Record<string, string>) {
  const all = Object.values(answers);
  const isScience = all.includes("science") || all.includes("research") || all.includes("hospital");
  const isTech = all.includes("tech") || all.includes("machines") || all.includes("math");
  const isCreative = all.includes("creative") || all.includes("arts");
  const isService = all.includes("helping") || all.includes("service");
  const isLeader = all.includes("leading");
  const isNature = all.includes("nature") || all.includes("outdoor");

  const interests: string[] = [];
  const strengths: string[] = [];
  const skills: string[] = [];

  if (isScience) { interests.push("विज्ञान आणि संशोधन"); strengths.push("विश्लेषणात्मक विचार"); skills.push("प्रयोगशाळा कौशल्ये"); }
  if (isTech) { interests.push("तंत्रज्ञान"); strengths.push("समस्यानिवारण"); skills.push("Coding / Digital"); }
  if (isCreative) { interests.push("सर्जनशीलता"); strengths.push("नवोन्मेषी विचार"); skills.push("Design / Art"); }
  if (isService) { interests.push("लोकसेवा"); strengths.push("सहानुभूती"); skills.push("संवाद कौशल्ये"); }
  if (isLeader) { interests.push("नेतृत्व"); strengths.push("व्यवस्थापन"); skills.push("Team Management"); }
  if (isNature) { interests.push("निसर्ग / शेती"); strengths.push("व्यावहारिक ज्ञान"); skills.push("Agricultural Knowledge"); }

  if (!interests.length) { interests.push("सामान्य"); strengths.push("बहुमुखी"); skills.push("Communication"); }

  return { interests, strengths, skills };
}

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

const demandConfig = {
  high: { label: "उच्च मागणी", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  medium: { label: "स्थिर मागणी", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  growing: { label: "वाढती मागणी", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
};

function CareerCard({ career, match, onClick, featured }: {
  career: Career; match?: number; onClick: () => void; featured?: boolean;
}) {
  const Icon = career.icon;
  const demand = demandConfig[career.demand];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-3xl overflow-hidden ${featured ? "ring-2 ring-yellow-400/60" : ""}`}
      style={{ background: `linear-gradient(135deg, ${career.accent}18, ${career.accent}08)`, border: `1px solid ${career.accent}30` }}
    >
      {featured && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full z-10">
          ⭐ TOP MATCH
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${career.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
            {career.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-white text-base leading-tight">{career.title}</h3>
            <p className="text-white/50 text-xs mt-0.5">{career.titleEn}</p>
          </div>
        </div>

        <p className="text-white/65 text-xs leading-relaxed mb-3 line-clamp-2">{career.desc}</p>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${demand.bg} ${demand.color} font-medium`}>
            {demand.label}
          </span>
          <span className="text-xs text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            💰 {career.salary}
          </span>
        </div>

        {match !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/50">Career Match</span>
              <span className="text-xs font-bold" style={{ color: career.accent }}>{match}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${match}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${career.accent}, ${career.accent}90)` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {career.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-white/8 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-white/40">{career.category}</span>
        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: career.accent }}>
          रोडमॅप पाहा <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}

function RoadmapModal({ career, onClose }: { career: Career; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const demand = demandConfig[career.demand];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal header */}
        <div className={`bg-gradient-to-br ${career.gradient} p-6 rounded-t-3xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{career.emoji}</div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">{career.title}</h2>
                <p className="text-white/70 text-sm">{career.titleEn}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">💰 {career.salary}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${demand.bg} ${demand.color}`}>{demand.label}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Roadmap */}
          <section>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Map className="w-4 h-4" style={{ color: career.accent }} /> करिअर रोडमॅप
            </h3>
            <div className="space-y-2">
              {career.roadmap.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = activeStep === i;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setActiveStep(isActive ? null : i)}
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                        style={{ background: isActive ? career.accent : "rgba(255,255,255,0.08)", border: `2px solid ${isActive ? career.accent : "rgba(255,255,255,0.1)"}` }}
                      >
                        <StepIcon className="w-4 h-4 text-white" />
                      </button>
                      {i < career.roadmap.length - 1 && (
                        <div className="w-0.5 h-full min-h-[16px] my-1" style={{ background: `${career.accent}30` }} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="font-bold text-white text-sm">{step.label}</p>
                      <p className="text-white/50 text-xs">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Subjects */}
          <section>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" style={{ color: career.accent }} /> आवश्यक विषय
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.subjects.map(s => (
                <span key={s} className="text-xs bg-white/8 border border-white/15 text-white/75 px-3 py-1.5 rounded-xl">{s}</span>
              ))}
            </div>
          </section>

          {/* Exams */}
          <section>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" style={{ color: career.accent }} /> प्रवेश परीक्षा
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.exams.map(e => (
                <span key={e} className="text-xs font-bold px-3 py-1.5 rounded-xl border" style={{ color: career.accent, borderColor: `${career.accent}40`, background: `${career.accent}10` }}>{e}</span>
              ))}
            </div>
          </section>

          {/* Colleges */}
          <section>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" style={{ color: career.accent }} /> महाविद्यालय पर्याय
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {career.colleges.map(c => (
                <div key={c} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/75 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: career.accent }} />
                  {c}
                </div>
              ))}
            </div>
          </section>

          {/* Career opportunities */}
          <section>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" style={{ color: career.accent }} /> करिअर संधी
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.opportunities.map(o => (
                <span key={o} className="text-xs bg-white/5 border border-white/10 text-white/65 px-3 py-1.5 rounded-xl">{o}</span>
              ))}
            </div>
          </section>

          {/* Scholarships */}
          <section>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" /> शिष्यवृत्ती
            </h3>
            <div className="space-y-2">
              {career.scholarships.map(s => (
                <div key={s} className="flex items-center gap-2 bg-yellow-400/8 border border-yellow-400/15 rounded-xl px-3 py-2">
                  <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="text-xs text-yellow-200">{s}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: career.accent }} /> आवश्यक कौशल्ये
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.skills.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-xl border" style={{ background: `${career.accent}12`, borderColor: `${career.accent}30`, color: career.accent }}>{s}</span>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

type View = "home" | "quiz" | "profile" | "explore";

export default function CareerOSPage() {
  const [view, setView] = useState<View>("home");
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("सर्व");

  // Derived state
  const quizComplete = quizStep >= QUIZ_QUESTIONS.length;
  const careerMatches = quizComplete ? calculateCareerMatches(answers) : {};
  const dnaProfile = quizComplete ? getDNAProfile(answers) : null;

  const categories = ["सर्व", ...Array.from(new Set(CAREERS.map(c => c.category)))];

  const filteredCareers = CAREERS.filter(c => {
    const matchesSearch = !searchQuery ||
      c.title.includes(searchQuery) ||
      c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.includes(searchQuery);
    const matchesCategory = filterCategory === "सर्व" || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedByMatch = quizComplete
    ? [...filteredCareers].sort((a, b) => (careerMatches[b.id] || 0) - (careerMatches[a.id] || 0))
    : filteredCareers;

  const topCareers = quizComplete
    ? [...CAREERS].sort((a, b) => (careerMatches[b.id] || 0) - (careerMatches[a.id] || 0)).slice(0, 3)
    : [];

  const readinessScore = quizComplete
    ? Math.round(Object.values(careerMatches).reduce((a, b) => a + b, 0) / CAREERS.length)
    : 0;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => setQuizStep(s => s + 1), 300);
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizStep(0);
    setView("quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 font-marathi text-white pb-20">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold leading-tight">Career OS</h1>
                <p className="text-[10px] text-white/40">मराठी करिअर डिस्कव्हरी प्लॅटफॉर्म</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quizComplete && (
              <div className="hidden sm:flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1.5 text-xs font-bold text-green-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> DNA Profile तयार
              </div>
            )}
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1.5 text-xs font-bold text-amber-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> ८० XP
            </div>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="max-w-6xl mx-auto flex gap-1 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "home", label: "🏠 होम" },
            { id: "quiz", label: "🧬 Career DNA" },
            { id: "explore", label: "🔍 करिअर एक्सप्लोर" },
            ...(quizComplete ? [{ id: "profile", label: "⭐ माझे प्रोफाइल" }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as View)}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                view === tab.id
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">

          {/* ══════════════════════════════ HOME ══════════════════════════════ */}
          {view === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">

              {/* Hero banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-blue-600/20 border border-violet-400/20 rounded-3xl p-6 md:p-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-1.5 text-xs font-bold text-violet-300 mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> AI Career Discovery Platform
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2">
                    तुमचे करिअर<br />
                    <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                      आत्ताच शोधा!
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm mb-6 max-w-md">
                    तुम्हाला आधीच माहित असण्याची गरज नाही की तुम्हाला काय व्हायचे आहे.
                    AI तुम्हाला तुमच्या आवडीनुसार करिअर शोधून देईल.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setView("quiz")}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-[0_4px_0_#3730a3] hover:shadow-[0_2px_0_#3730a3] hover:translate-y-0.5 transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Career DNA चाचणी सुरू करा
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setView("explore")}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 border border-white/20 transition-all"
                    >
                      <Search className="w-4 h-4" /> करिअर एक्सप्लोर करा
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              {quizComplete && dnaProfile && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Career Readiness", value: `${readinessScore}%`, icon: "🎯", color: "from-violet-500 to-indigo-600" },
                    { label: "Top Strengths", value: `${dnaProfile.strengths.length}`, icon: "💪", color: "from-amber-500 to-orange-600" },
                    { label: "Career Matches", value: `${topCareers.length}+`, icon: "⭐", color: "from-green-500 to-emerald-600" },
                    { label: "DNA Score", value: "A+", icon: "🧬", color: "from-pink-500 to-rose-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className={`text-xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
                      <div className="text-white/40 text-[11px] mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Top matched careers or sample careers */}
              {quizComplete && topCareers.length > 0 ? (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" /> तुमच्यासाठी सर्वोत्तम करिअर
                    </h3>
                    <button onClick={() => setView("explore")} className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1">
                      सर्व पाहा <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {topCareers.map((c, i) => (
                      <CareerCard key={c.id} career={c} match={careerMatches[c.id]}
                        featured={i === 0} onClick={() => setSelectedCareer(c)} />
                    ))}
                  </div>
                </section>
              ) : (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold">🔥 लोकप्रिय करिअर</h3>
                    <button onClick={() => setView("explore")} className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1">
                      सर्व पाहा <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CAREERS.slice(0, 6).map(c => (
                      <CareerCard key={c.id} career={c} onClick={() => setSelectedCareer(c)} />
                    ))}
                  </div>
                </section>
              )}

              {/* CTA for quiz */}
              {!quizComplete && (
                <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-400/20 rounded-3xl p-6 text-center">
                  <div className="text-4xl mb-3">🧬</div>
                  <h3 className="text-xl font-extrabold mb-2">Career DNA चाचणी द्या</h3>
                  <p className="text-white/50 text-sm mb-4">फक्त 5 प्रश्न — AI तुमच्यासाठी परफेक्ट करिअर शोधेल</p>
                  <button onClick={() => setView("quiz")}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3 rounded-2xl transition-colors">
                    आत्ता सुरू करा → 2 मिनिटे
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════ QUIZ ══════════════════════════════ */}
          {view === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-xl mx-auto">

              {!quizComplete ? (
                <div className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-violet-300">
                        प्रश्न {quizStep + 1} / {QUIZ_QUESTIONS.length}
                      </span>
                      <span className="text-xs text-white/40">{Math.round(((quizStep) / QUIZ_QUESTIONS.length) * 100)}% पूर्ण</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                        animate={{ width: `${(quizStep / QUIZ_QUESTIONS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <AnimatePresence mode="wait">
                    <motion.div key={quizStep}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="space-y-4">

                      <div className="bg-black/30 border border-white/10 rounded-3xl p-6 text-center">
                        <div className="text-5xl mb-4">{QUIZ_QUESTIONS[quizStep]?.emoji}</div>
                        <h2 className="text-xl font-extrabold text-white">
                          {QUIZ_QUESTIONS[quizStep]?.question}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {QUIZ_QUESTIONS[quizStep]?.options.map((opt, i) => (
                          <motion.button
                            key={opt.value}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => handleAnswer(QUIZ_QUESTIONS[quizStep].id, opt.value)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all font-medium text-white flex items-center gap-3 ${
                              answers[QUIZ_QUESTIONS[quizStep]?.id] === opt.value
                                ? "bg-violet-600/40 border-violet-400"
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-400/40"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-sm font-extrabold text-violet-300 shrink-0">
                              {String.fromCharCode(65 + i)}
                            </div>
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                /* Quiz complete — show teaser + go to profile */
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6">
                  <div className="bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-400/20 rounded-3xl p-8">
                    <div className="text-6xl mb-4">🧬</div>
                    <h2 className="text-2xl font-extrabold mb-2">Career DNA तयार झाले!</h2>
                    <p className="text-white/60 text-sm mb-6">AI ने तुमचे करिअर प्रोफाइल तयार केले आहे</p>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: "Interests", count: getDNAProfile(answers).interests.length, emoji: "❤️" },
                        { label: "Strengths", count: getDNAProfile(answers).strengths.length, emoji: "💪" },
                        { label: "Skills", count: getDNAProfile(answers).skills.length, emoji: "⚡" },
                      ].map(item => (
                        <div key={item.label} className="bg-white/10 rounded-2xl p-3 text-center">
                          <div className="text-xl mb-1">{item.emoji}</div>
                          <div className="text-lg font-extrabold">{item.count}</div>
                          <div className="text-[11px] text-white/50">{item.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => setView("profile")}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-[0_4px_0_#3730a3] hover:shadow-[0_2px_0_#3730a3] hover:translate-y-0.5 transition-all">
                        🎯 माझे Career DNA पाहा
                      </button>
                      <button onClick={() => setView("explore")}
                        className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold py-3 rounded-2xl transition-all">
                        🔍 सर्व करिअर एक्सप्लोर करा
                      </button>
                      <button onClick={resetQuiz}
                        className="text-white/40 hover:text-white/70 text-xs underline transition-colors">
                        पुन्हा चाचणी द्या
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════ PROFILE ══════════════════════════════ */}
          {view === "profile" && quizComplete && dnaProfile && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">

              {/* Career Readiness Score */}
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-600/25 to-indigo-600/15 border border-violet-400/20 rounded-3xl p-6">
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                      <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 264" }}
                        animate={{ strokeDasharray: `${readinessScore * 2.64} 264` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                      <span className="text-2xl font-extrabold text-white">{readinessScore}%</span>
                      <span className="text-[9px] text-white/40 leading-tight text-center">Career<br />Readiness</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-extrabold mb-1">तुमचे Career DNA</h2>
                    <p className="text-white/50 text-sm mb-3">AI ने तुमच्या उत्तरांवरून हे प्रोफाइल तयार केले आहे</p>
                    <button onClick={resetQuiz} className="text-xs text-violet-400 hover:text-violet-300 underline">
                      पुन्हा चाचणी द्या
                    </button>
                  </div>
                </div>
              </div>

              {/* DNA Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "❤️ आवडी (Interests)", items: dnaProfile.interests, color: "rose" },
                  { title: "💪 सामर्थ्य (Strengths)", items: dnaProfile.strengths, color: "amber" },
                  { title: "⚡ कौशल्ये (Skills)", items: dnaProfile.skills, color: "violet" },
                ].map(section => (
                  <div key={section.title} className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <h3 className="font-bold text-white mb-3 text-sm">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/75">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Recommended careers */}
              <section>
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" /> तुमच्यासाठी शिफारस केलेले करिअर
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedByMatch.slice(0, 6).map((c, i) => (
                    <CareerCard key={c.id} career={c} match={careerMatches[c.id]}
                      featured={i === 0} onClick={() => setSelectedCareer(c)} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ══════════════════════════════ EXPLORE ══════════════════════════════ */}
          {view === "explore" && (
            <motion.div key="explore" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-5">

              {/* Search + filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="करिअर शोधा... (Doctor, Engineer, शेती...)"
                    className="w-full bg-white/8 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-400 transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                        filterCategory === cat
                          ? "bg-violet-600 border-violet-500 text-white"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">
                  {sortedByMatch.length} करिअर उपलब्ध
                  {quizComplete && " • Match % दाखवला आहे"}
                </p>
                {!quizComplete && (
                  <button onClick={() => setView("quiz")}
                    className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> DNA चाचणी द्या
                  </button>
                )}
              </div>

              {/* Career grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedByMatch.map((c, i) => (
                  <CareerCard key={c.id} career={c}
                    match={quizComplete ? careerMatches[c.id] : undefined}
                    featured={quizComplete && i === 0}
                    onClick={() => setSelectedCareer(c)} />
                ))}
              </div>

              {sortedByMatch.length === 0 && (
                <div className="text-center py-16 text-white/40">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">कोणतेही परिणाम सापडले नाहीत</p>
                  <button onClick={() => { setSearchQuery(""); setFilterCategory("सर्व"); }} className="mt-2 text-xs text-violet-400 underline">
                    फिल्टर रीसेट करा
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Career Detail Modal ── */}
      <AnimatePresence>
        {selectedCareer && (
          <RoadmapModal career={selectedCareer} onClose={() => setSelectedCareer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
