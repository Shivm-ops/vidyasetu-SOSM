import Link from "next/link";
import { BookOpen, Users, Trophy, Wifi, Smartphone, Brain } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm">
              वि
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-none">विद्यासेतू</p>
              <p className="text-[10px] text-gray-500">VidyaSetu</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="#features" className="hover:text-brand-500">वैशिष्ट्ये</Link>
            <Link href="#about" className="hover:text-brand-500">आमच्याबद्दल</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
            >
              लॉगिन
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              सुरुवात करा
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-peacock-50 px-4 py-20 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-peacock-100/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            🏆 महाराष्ट्रातील #1 शैक्षणिक मंच
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-6xl font-marathi leading-tight">
            ज्ञान, कौशल्य, करिअर आणि समुदाय यांना{" "}
            <span className="gradient-text">जोडणारा सेतू</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600 md:text-xl max-w-2xl mx-auto">
            इयत्ता १ ते १२ साठी महाराष्ट्र राज्य मंडळ अभ्यासक्रम, AI शिक्षक,
            करिअर मार्गदर्शन आणि बरेच काही — मराठीत, ऑफलाइनही!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-brand-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-200 hover:bg-brand-600 transition-all hover:-translate-y-0.5"
            >
              आजच सुरुवात करा — मोफत 🚀
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto rounded-xl border-2 border-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-all"
            >
              डेमो पहा ▶
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ५० लाख+ विद्यार्थी • १ लाख+ शिक्षक • १०,०००+ शाळा
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-gray-50 py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "५०+", label: "लाख विद्यार्थी", icon: "👨‍🎓" },
              { value: "१ लाख+", label: "शिक्षक", icon: "👩‍🏫" },
              { value: "१०,०००+", label: "शाळा", icon: "🏫" },
              { value: "१०,०००+", label: "मराठी धडे", icon: "📚" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-brand-600">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-marathi mb-3">
              संपूर्ण शैक्षणिक परिसंस्था
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              फक्त अभ्यास नाही — जीवन कौशल्ये, करिअर, सामुदायिक सहभाग आणि मानसिक आरोग्य
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="subject-card">
                <div
                  className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: f.bg }}
                >
                  {f.icon}
                </div>
                <h3 className="mb-1 font-semibold text-gray-900 font-marathi">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="bg-gradient-to-br from-peacock-50 to-brand-50 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-marathi mb-12">
            कोणासाठी आहे विद्यासेतू?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {audience.map((a) => (
              <div
                key={a.role}
                className="rounded-2xl bg-white p-5 text-center shadow-sm card-lift"
              >
                <div className="text-4xl mb-3">{a.emoji}</div>
                <h3 className="font-semibold text-gray-900 font-marathi">{a.role}</h3>
                <p className="mt-1 text-xs text-gray-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline First */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 p-8 md:p-12 text-white text-center">
            <Wifi className="mx-auto mb-4 h-12 w-12 opacity-80" />
            <h2 className="text-3xl font-bold mb-3 font-marathi">
              इंटरनेट नसले तरी शिका!
            </h2>
            <p className="text-brand-100 text-lg mb-6 max-w-xl mx-auto">
              ऑफलाइन मोड, शाळा Wi-Fi सिंक, आणि Raspberry Pi Hub द्वारे
              गावातल्या प्रत्येक मुलापर्यंत शिक्षण पोहोचवा
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["📱 Android App", "💻 Smart TV", "🌐 PWA", "📡 Offline Hub"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-10 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                वि
              </div>
              <span className="font-bold text-gray-800 font-marathi">विद्यासेतू</span>
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              ज्ञान, कौशल्य, करिअर आणि समुदाय यांना जोडणारा सेतू
            </p>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} VidyaSetu. DPDP Act 2023 Compliant.
              Made with ❤️ for Rural Maharashtra.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "📚",
    bg: "#FFF7ED",
    title: "महाराष्ट्र अभ्यासक्रम",
    description: "इयत्ता १ ते १२ साठी संपूर्ण राज्य मंडळ अभ्यासक्रम मराठीत",
  },
  {
    icon: "🤖",
    bg: "#EFF6FF",
    title: "AI मराठी शिक्षक",
    description: "तुमच्या प्रश्नांची उत्तरे मराठीत देणारा AI, २४×७",
  },
  {
    icon: "🎯",
    bg: "#F0FDF4",
    title: "करिअर मार्गदर्शन",
    description: "ग्रामीण पार्श्वभूमीसाठी अनुकूल करिअर सल्ला आणि शिष्यवृत्ती माहिती",
  },
  {
    icon: "📊",
    bg: "#FDF4FF",
    title: "प्रगती ट्रॅकिंग",
    description: "विद्यार्थ्याची प्रत्येक चळवळ — उपस्थिती, गुण, कौशल्ये",
  },
  {
    icon: "🏆",
    bg: "#FFFBEB",
    title: "वारी शिक्षण प्रवास",
    description: "बॅज, पॉइंट्स आणि पातळ्यांद्वारे शिकण्यास प्रेरणा",
  },
  {
    icon: "🌱",
    bg: "#F0FDF4",
    title: "ग्राम शिक्षण मंडळ",
    description: "गावातील शिक्षण मंडळे, मेंटरशिप आणि सामुदायिक प्रकल्प",
  },
];

const audience = [
  { emoji: "👨‍🎓", role: "विद्यार्थी", desc: "इयत्ता १ ते १२" },
  { emoji: "👩‍🏫", role: "शिक्षक", desc: "AI सहाय्यकासह" },
  { emoji: "👨‍👩‍👧", role: "आई-बाबा", desc: "मराठी रिपोर्ट" },
  { emoji: "🏫", role: "शाळा", desc: "संपूर्ण व्यवस्थापन" },
  { emoji: "🤝", role: "NGO / CSR", desc: "प्रभाव मोजमाप" },
];
