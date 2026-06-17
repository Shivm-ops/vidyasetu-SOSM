// VidyaSetu Curriculum Data
// Maharashtra State Board — Class 1 to 10
// Full content: Class 5, 6, 7 | Partial: Class 8, 9, 10 | Stubs: Class 1-4

export type Difficulty = "सोपे" | "मध्यम" | "कठीण";
export type Subject = "mathematics" | "science" | "marathi" | "english" | "social_science";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  titleEn: string;
  duration: string; // estimated learning time
  difficulty: Difficulty;
  learningOutcome: string;
  whyImportant: string;       // AI: Why this matters
  realLifeConnection: string; // Local Maharashtra context
  concept: string;            // Core explanation in Marathi
  keyPoints: string[];
  quiz: QuizQuestion[];
  activity: { title: string; steps: string[] };
  project: { title: string; description: string };
  relatedTopics?: string[];
  has3D?: boolean;
  threeDRoute?: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleEn: string;
  topics: Topic[];
  icon: string;
}

export interface SubjectData {
  id: Subject;
  title: string;
  titleEn: string;
  color: string;
  bgColor: string;
  icon: string;
  chapters: Chapter[];
}

export interface ClassData {
  id: number;
  label: string;
  ageRange: string;
  isFullContent: boolean;
  subjects: SubjectData[];
}

// ============================================================
// MATHEMATICS DATA
// ============================================================

const math5Chapters: Chapter[] = [
  {
    id: "fractions",
    title: "अपूर्णांक",
    titleEn: "Fractions",
    icon: "½",
    topics: [
      {
        id: "intro-fractions",
        title: "अपूर्णांक म्हणजे काय?",
        titleEn: "What are Fractions?",
        duration: "30 मिनिटे",
        difficulty: "सोपे",
        learningOutcome: "विद्यार्थी अपूर्णांकाची संकल्पना समजतील आणि सोपे अपूर्णांक लिहू शकतील.",
        whyImportant: "आपण रोज पिझ्झाचा तुकडा, रोटीचा भाग, किंवा दुधाचा ग्लास अर्धा भरतो — हे सर्व अपूर्णांकच आहेत!",
        realLifeConnection: "शेतकरी जेव्हा शेत विभागतो, मजूर मजुरी वाटतो, किंवा आई रोटी विभागते — तेव्हा अपूर्णांकच वापरतात.",
        concept: "जेव्हा एखादी वस्तू समान भागांमध्ये विभागली जाते, तेव्हा त्या भागांपैकी एक किंवा अनेक भागांना अपूर्णांक म्हणतात.\n\nउदाहरण: एक संत्रा ४ भागांमध्ये विभागला. तुम्ही १ भाग घेतला → तुमचा भाग = १/४\n\nलिखाण: अंश/छेद → १/४ मध्ये १ = अंश, ४ = छेद",
        keyPoints: [
          "अपूर्णांकात अंश (वर) आणि छेद (खाली) असतो.",
          "छेद = एकूण समान भाग",
          "अंश = घेतलेले भाग",
          "१/२ म्हणजे अर्धा, १/४ म्हणजे पाव",
        ],
        quiz: [
          { q: "एक आंबा ४ भागांत विभागला, २ भाग घेतले. अपूर्णांक कोणता?", options: ["१/४", "२/४", "४/२", "१/२"], answer: 1, explanation: "२ भाग घेतले म्हणून अंश = २, एकूण ४ भाग म्हणून छेद = ४. उत्तर = २/४" },
          { q: "१/२ म्हणजे काय?", options: ["एक चतुर्थांश", "एक तृतीयांश", "अर्धा", "संपूर्ण"], answer: 2, explanation: "१/२ = अर्धा भाग" },
          { q: "अपूर्णांकात छेद म्हणजे काय?", options: ["घेतलेले भाग", "एकूण समान भाग", "उरलेले भाग", "मोठे भाग"], answer: 1, explanation: "छेद म्हणजे वस्तूचे एकूण समान भाग" },
          { q: "कोणता अपूर्णांक मोठा? ½ की ¼?", options: ["¼", "½", "दोन्ही समान", "सांगता येत नाही"], answer: 1, explanation: "½ मोठा आहे कारण अर्धा भाग पावापेक्षा मोठा असतो." },
          { q: "३/३ = ?", options: ["०", "½", "१", "३"], answer: 2, explanation: "जेव्हा अंश = छेद, तेव्हा अपूर्णांक = १ (संपूर्ण)" },
        ],
        activity: {
          title: "रोटी विभाजन खेळ",
          steps: [
            "एक गोल कागद घ्या — तो रोटी आहे.",
            "त्याला मधून दुमडून दोन समान भाग करा.",
            "एका भागावर '½' लिहा.",
            "पुन्हा दुमडा — आता ४ भाग झाले. '¼' लिहा.",
            "आपल्या कुटुंबातील ४ जणांमध्ये वाटा!",
          ],
        },
        project: {
          title: "घरातील अपूर्णांक डायरी",
          description: "एक आठवडा घरातील सर्व अपूर्णांक गोष्टी नोंदवा — जसे अर्धा ग्लास दूध, पाव किलो साखर, दोन तृतीयांश शेत. त्यांचे चित्र काढा आणि अपूर्णांक लिहा.",
        },
      },
      {
        id: "fractions-compare",
        title: "अपूर्णांकांची तुलना",
        titleEn: "Comparing Fractions",
        duration: "35 मिनिटे",
        difficulty: "मध्यम",
        learningOutcome: "विद्यार्थी एकाच छेदाचे आणि वेगवेगळ्या छेदाचे अपूर्णांक तुलना करू शकतील.",
        whyImportant: "दोन मुलांना वेगवेगळे तुकडे मिळाले — कोणाला जास्त मिळाले हे कळायला तुलना लागते!",
        realLifeConnection: "शेतकऱ्याचे ½ शेत आणि शेजाऱ्याचे ⅓ शेत — कोणाचे मोठे? हे ठरवायला अपूर्णांक तुलना येते.",
        concept: "समान छेद असेल तर: जो अंश मोठा त्याचा अपूर्णांक मोठा.\nउदा: ३/५ > २/५\n\nवेगळा छेद असेल तर: आधी समान छेद करा (LCM वापरा).\nउदा: ½ vs ⅓ → ३/६ vs २/६ → ½ > ⅓",
        keyPoints: [
          "समान छेद → मोठ्या अंशाचा अपूर्णांक मोठा",
          "वेगळा छेद → आधी LCM काढा",
          "एकसमान अपूर्णांक = समान मूल्य",
        ],
        quiz: [
          { q: "३/७ आणि ५/७ मध्ये कोणता मोठा?", options: ["३/७", "५/७", "दोन्ही समान", "सांगता येत नाही"], answer: 1, explanation: "समान छेद असल्यास मोठ्या अंशाचा अपूर्णांक मोठा. ५ > ३ म्हणून ५/७ मोठा." },
          { q: "½ आणि ⅓ मध्ये कोणता मोठा?", options: ["½", "⅓", "दोन्ही समान", "सांगता येत नाही"], answer: 0, explanation: "LCM(2,3)=6. ½=3/6, ⅓=2/6. म्हणून ½ मोठा." },
          { q: "सर्वात लहान अपूर्णांक कोणता?", options: ["⅔", "¾", "⅙", "½"], answer: 2, explanation: "⅙ = 0.167 — सर्वात लहान आहे." },
          { q: "४/५ < __ हे खरे आहे?", options: ["३/५", "४/५", "५/५", "२/५"], answer: 2, explanation: "५/५ = १ जे ४/५ पेक्षा मोठे आहे." },
          { q: "½ = ?/४", options: ["१", "२", "३", "४"], answer: 1, explanation: "½ = २/४ (दोन्ही बाजूंना ×२)" },
        ],
        activity: {
          title: "अपूर्णांक शर्यत",
          steps: [
            "कागदावर ० ते १ अशी रेषा काढा.",
            "½, ⅓, ¼, ¾ हे अपूर्णांक योग्य ठिकाणी चिन्हांकित करा.",
            "मित्राला विचारा — कोणता सर्वात मोठा?",
            "उत्तर तपासा!",
          ],
        },
        project: {
          title: "अपूर्णांक चित्रपट",
          description: "शाळेतील खेळांना ½ मैदान, ⅓ बाग अशा भागांत विभागा. चित्र काढा आणि प्रत्येक भागाचा अपूर्णांक लिहा.",
        },
      },
    ],
  },
  {
    id: "decimals",
    title: "दशांश संख्या",
    titleEn: "Decimals",
    icon: ".",
    topics: [
      {
        id: "intro-decimals",
        title: "दशांश म्हणजे काय?",
        titleEn: "Introduction to Decimals",
        duration: "30 मिनिटे",
        difficulty: "सोपे",
        learningOutcome: "विद्यार्थी दशांश संख्यांची संकल्पना समजतील आणि वाचू-लिहू शकतील.",
        whyImportant: "दुकानात वस्तूंच्या किंमती — ₹१२.५०, ₹७.७५ — या सर्व दशांश आहेत. पैशांचे हिशोब ठेवायला दशांश येणे आवश्यक आहे.",
        realLifeConnection: "भाजीवाला ५०० ग्रॅम टमाटे तोलतो = ०.५ किलो. खते ७.५ लिटर मोजतो. शेतीत वजन आणि माप सर्वत्र दशांश.",
        concept: "दशांश म्हणजे १०च्या भागांमध्ये मांडलेल्या संख्या.\n\n१२.५ मध्ये:\n• १२ = पूर्ण भाग\n• .५ = दशांश भाग (पाच दहावे)\n\n.५ = ५/१० = ½\n.२५ = २५/१०० = ¼",
        keyPoints: [
          "दशांश बिंदू (.) पूर्ण आणि दशांश भाग वेगळा करतो.",
          ".१ = एक दशांश = १/१०",
          ".०१ = एक शतांश = १/१००",
          "दशांश ओळींमध्ये जोडता येतात.",
        ],
        quiz: [
          { q: "०.५ = ?", options: ["5/100", "5/10", "1/5", "5/1"], answer: 1, explanation: "०.५ = ५/१० = अर्धा" },
          { q: "₹१२.७५ मध्ये दशांश भाग कोणता?", options: ["१२", ".७५", "७५", ".७"], answer: 1, explanation: ".७५ हा दशांश भाग आहे — म्हणजे ७५ पैसे." },
          { q: "०.१ + ०.२ = ?", options: ["०.१२", "०.३", "१.२", "०.०३"], answer: 1, explanation: "दशांश जोडताना: ०.१ + ०.२ = ०.३" },
          { q: "1 किलो = ? ग्रॅम दशांशात", options: ["०.१", "१.०", "१०", "१०००"], answer: 1, explanation: "१ किलो = १.० किलो = १००० ग्रॅम" },
          { q: "मोठा कोण? ०.८ की ०.७९?", options: ["०.७९", "०.८", "दोन्ही समान", "सांगता येत नाही"], answer: 1, explanation: "०.८ = ०.८०. ०.८० > ०.७९" },
        ],
        activity: {
          title: "बाजार हिशोब",
          steps: [
            "घरातून ३ वस्तूंच्या किंमती लिहा (उदा: दूध ₹२४.५०).",
            "प्रत्येक किंमतीतील पूर्ण आणि दशांश भाग वेगळा करा.",
            "तिन्ही किंमती जोडा — एकूण खर्च किती?",
            "आईला दाखवा!",
          ],
        },
        project: {
          title: "बाजारातील दशांश",
          description: "बाजारात जाऊन ५ वस्तूंच्या किंमती नोंदवा. त्यांना मोठ्यापासून लहानपर्यंत लावा. एकूण खर्च काढा.",
        },
      },
    ],
  },
  {
    id: "geometry",
    title: "भूमिती",
    titleEn: "Geometry",
    icon: "△",
    topics: [
      {
        id: "triangles",
        title: "त्रिकोण",
        titleEn: "Triangles",
        duration: "40 मिनिटे",
        difficulty: "मध्यम",
        learningOutcome: "विद्यार्थी त्रिकोणाचे प्रकार ओळखतील आणि कोनांची बेरीज सिद्ध करतील.",
        whyImportant: "त्रिकोण हा सर्वात मजबूत आकार आहे. पूल, इमारती, छप्पर — सर्वत्र त्रिकोण वापरतात!",
        realLifeConnection: "गावातील घराचे छप्पर त्रिकोणी असते. हे का? कारण त्रिकोण भार सहन करतो आणि वाकत नाही.",
        concept: "त्रिकोण = ३ बाजू + ३ कोन\n\nत्रिकोणाचे प्रकार:\n• समभुज: तिन्ही बाजू समान, तिन्ही कोन ६०°\n• समद्विभुज: दोन बाजू समान\n• विषमभुज: तिन्ही बाजू वेगवेगळ्या\n• काटकोन: एक कोन ९०°\n\nनियम: तिन्ही कोनांची बेरीज = १८०°",
        keyPoints: [
          "त्रिकोणाला ३ बाजू आणि ३ कोन असतात.",
          "कोनांची बेरीज नेहमी १८०°",
          "समभुज त्रिकोण: सर्व बाजू व कोन समान",
          "काटकोन त्रिकोणात एक ९०° कोन असतो.",
        ],
        quiz: [
          { q: "त्रिकोणाच्या कोनांची बेरीज किती?", options: ["९०°", "१८०°", "२७०°", "३६०°"], answer: 1, explanation: "कोणत्याही त्रिकोणाचे तिन्ही कोन मिळवले की १८०° येतो." },
          { q: "समभुज त्रिकोणाचा प्रत्येक कोन किती?", options: ["४५°", "६०°", "९०°", "१२०°"], answer: 1, explanation: "समभुज त्रिकोणात तिन्ही कोन समान = १८०°÷३ = ६०°" },
          { q: "काटकोन त्रिकोणात ९०° व्यतिरिक्त दोन कोनांची बेरीज किती?", options: ["४५°", "९०°", "१३५°", "१८०°"], answer: 1, explanation: "९०° + उरलेले = १८०° → उरलेले = ९०°" },
          { q: "त्रिकोण हा इमारतींत का वापरतात?", options: ["सुंदर दिसतो", "सर्वात मजबूत आकार आहे", "बनवायला सोपा", "मोठा असतो"], answer: 1, explanation: "त्रिकोण भार समान विभागतो — म्हणून सर्वात मजबूत आकार." },
          { q: "एका त्रिकोणाचे दोन कोन ७०° आणि ६०° आहेत. तिसरा कोन किती?", options: ["४०°", "५०°", "६०°", "७०°"], answer: 1, explanation: "७०+६०+x=१८० → x=५०°" },
        ],
        activity: {
          title: "त्रिकोण शोधा",
          steps: [
            "घराच्या आजूबाजूला फिरा.",
            "दिसणाऱ्या सर्व त्रिकोणी आकारांची यादी करा.",
            "प्रत्येक त्रिकोण कोणत्या प्रकारचा आहे ते लिहा.",
            "छप्पराचा कोन मोजण्याचा प्रयत्न करा!",
          ],
        },
        project: {
          title: "त्रिकोण पूल",
          description: "काड्या आणि मातीने एक पूल बनवा. त्यात त्रिकोणी रचना वापरा. किती वजन सहन करतो ते तपासा आणि त्रिकोणांची संख्या मोजा.",
        },
      },
    ],
  },
];

const science6Chapters: Chapter[] = [
  {
    id: "living-world",
    title: "सजीव विश्व",
    titleEn: "The Living World",
    icon: "🌿",
    topics: [
      {
        id: "characteristics-of-life",
        title: "सजीवांची वैशिष्ट्ये",
        titleEn: "Characteristics of Living Things",
        duration: "35 मिनिटे",
        difficulty: "सोपे",
        learningOutcome: "विद्यार्थी सजीव आणि निर्जीव यातील फरक ओळखतील आणि सजीवांची वैशिष्ट्ये सांगतील.",
        whyImportant: "सजीव-निर्जीव फरक कळला की विज्ञानाची मूळ संकल्पना समजते. आपण स्वतः सजीव का आहोत हे समजते!",
        realLifeConnection: "शेतातील पीक वाढते, पाणी प्यायते, बीज बनवते — ते सजीव आहे. शेतातील दगड, खुरपे — ते निर्जीव आहेत.",
        concept: "सजीव वैशिष्ट्ये:\n1. वाढ (Growth) — मुलगा रोज मोठा होतो\n2. श्वसन (Respiration) — ऑक्सिजन घेतो\n3. पोषण (Nutrition) — अन्न खातो\n4. उत्सर्जन (Excretion) — टाकाऊ पदार्थ बाहेर काढतो\n5. जनन (Reproduction) — मुले होतात\n6. संवेदना (Sensitivity) — स्पर्श जाणवतो\n7. हालचाल (Movement) — स्वतःहून हलतो",
        keyPoints: [
          "सजीव वाढतात, श्वसन करतात, पोषण घेतात.",
          "सजीव जनन करतात — नवीन सजीव बनवतात.",
          "झाडे सजीव आहेत — ते वाढतात, श्वास घेतात.",
          "दगड, पाणी, हवा निर्जीव आहेत — ते वाढत नाहीत.",
        ],
        quiz: [
          { q: "सजीवांचे कोणते वैशिष्ट्य निर्जीवात नसते?", options: ["रंग असणे", "वाढ होणे", "पाण्यात असणे", "जड असणे"], answer: 1, explanation: "वाढ (Growth) फक्त सजीवांमध्ये होते." },
          { q: "खालीलपैकी कोण सजीव आहे?", options: ["दगड", "नदी", "बेडूक", "वाऱ्याची झुळूक"], answer: 2, explanation: "बेडूक सजीव आहे — तो वाढतो, श्वास घेतो, जनन करतो." },
          { q: "जनन म्हणजे काय?", options: ["खाणे", "श्वास घेणे", "नवीन सजीव तयार करणे", "वाढणे"], answer: 2, explanation: "जनन = Reproduction = नवीन पिढी तयार करणे" },
          { q: "झाड सजीव का आहे?", options: ["हिरवे आहे", "ते वाढते, श्वास घेते, बीज बनवते", "मोठे आहे", "दिसते"], answer: 1, explanation: "वाढ, श्वसन, जनन — ही सर्व सजीव वैशिष्ट्ये झाडात असतात." },
          { q: "श्वसन म्हणजे काय?", options: ["चालणे", "ऑक्सिजन घेणे आणि CO₂ सोडणे", "खाणे", "झोपणे"], answer: 1, explanation: "श्वसन = ऑक्सिजन आत घेणे, CO₂ बाहेर सोडणे" },
        ],
        activity: {
          title: "सजीव-निर्जीव सर्वेक्षण",
          steps: [
            "घराभोवती किंवा शाळेत फिरा.",
            "१० गोष्टी निवडा — काही सजीव, काही निर्जीव.",
            "त्यांचे नाव आणि ते सजीव/निर्जीव का ते लिहा.",
            "कोणत्या वैशिष्ट्यांमुळे ते सजीव/निर्जीव आहेत?",
          ],
        },
        project: {
          title: "सजीव डायरी",
          description: "एक झाड किंवा रोप निवडा. ७ दिवस त्याची वाढ, पाने, रंग यांचे निरीक्षण करा. रोज नोंदी ठेवा. आठव्या दिवशी सादर करा.",
        },
        has3D: true,
        threeDRoute: "/classroom/science-lab",
      },
    ],
  },
  {
    id: "human-body",
    title: "मानवी शरीर",
    titleEn: "Human Body",
    icon: "🫀",
    topics: [
      {
        id: "heart",
        title: "हृदय — रक्ताचा पंप",
        titleEn: "Heart — The Blood Pump",
        duration: "40 मिनिटे",
        difficulty: "मध्यम",
        learningOutcome: "विद्यार्थी हृदयाची रचना, कार्य आणि रक्ताभिसरण प्रक्रिया समजतील.",
        whyImportant: "हृदय आपल्या शरीराचे इंजिन आहे. ते बंद झाले की जीव जातो. हृदय निरोगी ठेवणे म्हणजे आयुष्य वाढवणे!",
        realLifeConnection: "शेतातील विहीर जशी पाणी सर्वत्र पुरवते, तसे हृदय रक्त सर्व अवयवांपर्यंत पोहोचवते.",
        concept: "हृदय = रक्ताचा पंप\n\nहृदयाचे ४ कप्पे:\n• उजवा अट्रियम — फुफ्फुसातून रक्त येते\n• उजवा वेंट्रिकल — फुफ्फुसात रक्त पाठवतो\n• डावा अट्रियम — ऑक्सिजनयुक्त रक्त येते\n• डावा वेंट्रिकल — सर्व शरीरात रक्त पाठवतो\n\nहृदय प्रति मिनिट ७२ वेळा धडधडते.",
        keyPoints: [
          "हृदयाचे ४ कप्पे असतात.",
          "प्रति मिनिट ७२ वेळा धडधड — दिवसात ₹1 लाख वेळा!",
          "डावा वेंट्रिकल सर्वात महत्त्वाचा — तो संपूर्ण शरीरात रक्त पाठवतो.",
          "व्यायाम केल्यास हृदय जास्त वेगाने धडधडते.",
        ],
        quiz: [
          { q: "हृदयाचे किती कप्पे असतात?", options: ["२", "३", "४", "५"], answer: 2, explanation: "हृदयाचे ४ कप्पे — २ अट्रियम + २ वेंट्रिकल." },
          { q: "हृदय प्रति मिनिट किती वेळा धडधडते?", options: ["३६", "७२", "१०८", "१४४"], answer: 1, explanation: "सामान्य हृदयाचे ठोके = ७२ प्रति मिनिट." },
          { q: "कोणता कप्पा संपूर्ण शरीरात रक्त पाठवतो?", options: ["उजवा अट्रियम", "उजवा वेंट्रिकल", "डावा अट्रियम", "डावा वेंट्रिकल"], answer: 3, explanation: "डावा वेंट्रिकल सर्वात शक्तिशाली — सर्व शरीरात रक्त पाठवतो." },
          { q: "हृदय कोणत्या प्रकारचा स्नायू आहे?", options: ["ऐच्छिक", "अनैच्छिक", "अस्थि", "त्वचा"], answer: 1, explanation: "हृदय अनैच्छिक स्नायू — आपण न सांगता आपोआप काम करतो." },
          { q: "व्यायामाने हृदयाचे काय होते?", options: ["बंद होते", "मंद होते", "जास्त वेगाने धडधडते", "कमी काम करते"], answer: 2, explanation: "व्यायामाने शरीराला जास्त ऑक्सिजन लागतो, म्हणून हृदय जास्त वेगाने रक्त पंप करते." },
        ],
        activity: {
          title: "हृदयाचे ठोके मोजा",
          steps: [
            "शांत बसा. मनगटावर नाडी शोधा.",
            "३० सेकंद ठोके मोजा आणि दुप्पट करा — प्रति मिनिट ठोके मिळतील.",
            "आता ५ मिनिटे पळा.",
            "पुन्हा ठोके मोजा — फरक किती?",
            "नोंद करा.",
          ],
        },
        project: {
          title: "हृदय स्वास्थ्य सर्वेक्षण",
          description: "कुटुंबातील ५ सदस्यांचे हृदयाचे ठोके मोजा. वयानुसार बदल लक्षात घ्या. चार्ट बनवा आणि निष्कर्ष लिहा.",
        },
        has3D: true,
        threeDRoute: "/classroom/science-lab",
      },
      {
        id: "brain",
        title: "मेंदू — नियंत्रण केंद्र",
        titleEn: "Brain — Control Center",
        duration: "40 मिनिटे",
        difficulty: "मध्यम",
        learningOutcome: "विद्यार्थी मेंदूची रचना आणि विविध भागांचे कार्य समजतील.",
        whyImportant: "मेंदू हा आपला सुपरकॉम्प्युटर आहे! चांगला अभ्यास, चांगला आहार, व्यायाम — मेंदू मजबूत राहतो.",
        realLifeConnection: "शेतातील सिंचन प्रणाली जशी शेताला नियंत्रित करते, तसा मेंदू संपूर्ण शरीराला नियंत्रित करतो.",
        concept: "मेंदू = शरीराचा सुपरकॉम्प्युटर\n\nमुख्य भाग:\n• पुढील लोब (Frontal Lobe) — विचार, निर्णय, व्यक्तिमत्व\n• ऐहिक लोब (Temporal Lobe) — ऐकणे, स्मृती\n• परिणती लोब (Parietal Lobe) — स्पर्श, स्थान\n• अनुमस्तिष्क (Cerebellum) — संतुलन, हालचाल\n\nमेंदूत ८६ अब्ज न्यूरॉन्स आहेत.",
        keyPoints: [
          "मेंदूत ८६ अब्ज न्यूरॉन्स (चेतापेशी) आहेत.",
          "मेंदू शरीराच्या २०% ऊर्जा वापरतो.",
          "झोप मेंदूसाठी अत्यंत महत्त्वाची आहे.",
          "डावा मेंदू — भाषा, गणित. उजवा — सर्जनशीलता, कला.",
        ],
        quiz: [
          { q: "मेंदूत किती न्यूरॉन्स असतात?", options: ["८६ लाख", "८६ कोटी", "८६ अब्ज", "८६ हजार"], answer: 2, explanation: "मेंदूत तब्बल ८६ अब्ज (86 billion) न्यूरॉन्स असतात." },
          { q: "कोणता भाग संतुलन राखतो?", options: ["पुढील लोब", "ऐहिक लोब", "अनुमस्तिष्क", "मेरुरज्जू"], answer: 2, explanation: "अनुमस्तिष्क (Cerebellum) शरीराचे संतुलन आणि हालचाल नियंत्रित करतो." },
          { q: "मेंदू किती % ऊर्जा वापरतो?", options: ["५%", "१०%", "२०%", "५०%"], answer: 2, explanation: "मेंदू शरीराच्या फक्त २% वजनाचा पण २०% ऊर्जा वापरतो!" },
          { q: "निर्णय घेण्याचे काम कोणता भाग करतो?", options: ["अनुमस्तिष्क", "पुढील लोब", "ऐहिक लोब", "मेरुरज्जू"], answer: 1, explanation: "पुढील लोब (Frontal Lobe) निर्णय, नियोजन आणि व्यक्तिमत्व नियंत्रित करतो." },
          { q: "मेंदूसाठी कोणती गोष्ट सर्वात महत्त्वाची?", options: ["टीव्ही पाहणे", "झोप आणि व्यायाम", "जास्त खाणे", "थंड हवा"], answer: 1, explanation: "पुरेशी झोप आणि व्यायाम मेंदूला निरोगी ठेवतात." },
        ],
        activity: {
          title: "स्मृती खेळ",
          steps: [
            "कागदावर १५ वस्तूंची यादी लिहा.",
            "१ मिनिट वाचा आणि लपवा.",
            "किती लक्षात राहिले ते लिहा.",
            "उद्या पुन्हा प्रयत्न करा — स्मृती सुधारेल!",
          ],
        },
        project: {
          title: "मेंदू आरोग्य चार्ट",
          description: "एक आठवडा झोप, खाणे, व्यायाम, अभ्यास यांची नोंद ठेवा. त्याचा अभ्यासावर काय परिणाम झाला ते लिहा.",
        },
        has3D: true,
        threeDRoute: "/classroom/science-lab",
      },
    ],
  },
  {
    id: "plants",
    title: "वनस्पती",
    titleEn: "Plants",
    icon: "🌱",
    topics: [
      {
        id: "photosynthesis",
        title: "प्रकाशसंश्लेषण",
        titleEn: "Photosynthesis",
        duration: "45 मिनिटे",
        difficulty: "मध्यम",
        learningOutcome: "विद्यार्थी प्रकाशसंश्लेषण प्रक्रिया, घटक आणि महत्त्व समजतील.",
        whyImportant: "झाडे सूर्यप्रकाशापासून अन्न बनवतात — हे न कळल्यास शेती, पर्यावरण काहीच समजत नाही!",
        realLifeConnection: "शेतातील पीक — ज्वारी, बाजरी, ऊस — सर्व सूर्यप्रकाश घेऊन अन्न बनवतात. शेती ही प्रकाशसंश्लेषणावर अवलंबून आहे!",
        concept: "प्रकाशसंश्लेषण = सूर्यप्रकाश + पाणी + CO₂ → ग्लुकोज + O₂\n\nसमीकरण:\n6CO₂ + 6H₂O + सूर्यप्रकाश → C₆H₁₂O₆ + 6O₂\n\nकोठे होते? — पानातील हरितद्रव्य (Chlorophyll) मध्ये\nकेव्हा होते? — दिवसा, सूर्यप्रकाशात",
        keyPoints: [
          "हरितद्रव्य (Chlorophyll) पानांना हिरवा रंग देते.",
          "झाडे CO₂ घेतात आणि O₂ सोडतात.",
          "प्रकाशसंश्लेषणामुळे वातावरणात ऑक्सिजन राहतो.",
          "रात्री झाडे O₂ घेतात, CO₂ सोडतात.",
        ],
        quiz: [
          { q: "प्रकाशसंश्लेषणाचे मुख्य घटक कोणते?", options: ["पाणी + माती", "सूर्यप्रकाश + पाणी + CO₂", "खत + माती", "वारा + पाणी"], answer: 1, explanation: "सूर्यप्रकाश, पाणी आणि CO₂ हे तीन मुख्य घटक आहेत." },
          { q: "हरितद्रव्य कोठे असते?", options: ["मुळात", "खोडात", "पानात", "फुलात"], answer: 2, explanation: "पानातील हरितद्रव्य (Chlorophyll) प्रकाशसंश्लेषण करते." },
          { q: "प्रकाशसंश्लेषणात कोणता वायू तयार होतो?", options: ["CO₂", "N₂", "O₂", "H₂"], answer: 2, explanation: "प्रकाशसंश्लेषणात ऑक्सिजन (O₂) तयार होतो — आपण तो श्वासात घेतो!" },
          { q: "प्रकाशसंश्लेषण केव्हा होत नाही?", options: ["सकाळी", "दुपारी", "रात्री", "ढगाळ दिवशी"], answer: 2, explanation: "रात्री सूर्यप्रकाश नसतो — म्हणून प्रकाशसंश्लेषण होत नाही." },
          { q: "शेतातील पिके प्रकाशसंश्लेषणातून काय मिळवतात?", options: ["पाणी", "खत", "अन्न (ग्लुकोज)", "माती"], answer: 2, explanation: "ग्लुकोज (साखर) हे झाडाचे अन्न — प्रकाशसंश्लेषणातून तयार होते." },
        ],
        activity: {
          title: "पाण्याखाली बुडबुडे",
          steps: [
            "एक हिरवी पाने असलेली फांदी घ्या.",
            "ती पाण्याच्या भांड्यात ठेवा.",
            "उन्हात ठेवा आणि पाहा — बुडबुडे येतात का?",
            "हे बुडबुडे ऑक्सिजनचे आहेत!",
          ],
        },
        project: {
          title: "शेती आणि सूर्यप्रकाश",
          description: "एक रोप घ्या. एक भाग उन्हात, एक भाग छायेत ठेवा. ७ दिवसांनी फरक नोंदवा. प्रकाशसंश्लेषणाचे महत्त्व सिद्ध करा.",
        },
      },
    ],
  },
];

const socialScience7Chapters: Chapter[] = [
  {
    id: "maharashtra-geography",
    title: "महाराष्ट्राचा भूगोल",
    titleEn: "Geography of Maharashtra",
    icon: "🗺️",
    topics: [
      {
        id: "rivers-of-maharashtra",
        title: "महाराष्ट्राच्या नद्या",
        titleEn: "Rivers of Maharashtra",
        duration: "45 मिनिटे",
        difficulty: "मध्यम",
        learningOutcome: "विद्यार्थी महाराष्ट्रातील प्रमुख नद्यांचे नाव, उगम आणि महत्त्व सांगतील.",
        whyImportant: "नद्या शेतीला, पिण्याच्या पाण्याला आणि उद्योगांना जीवन देतात. नदीशिवाय गाव नाही, शेती नाही.",
        realLifeConnection: "तुमच्या गावाजवळून कोणती नदी वाहते? त्या नदीच्या पाण्यावर किती शेते, किती लोक अवलंबून आहेत?",
        concept: "महाराष्ट्राच्या प्रमुख नद्या:\n\n1. गोदावरी — उगम: नाशिक. दक्षिण गंगा. सर्वात मोठी नदी.\n2. कृष्णा — उगम: महाबळेश्वर. कर्नाटक, आंध्र प्रदेशातून वाहते.\n3. नर्मदा — उगम: अमरकंटक. पूर्व ते पश्चिम वाहते.\n4. तापी — उगम: मध्य प्रदेश. महाराष्ट्रातून गुजरातला जाते.\n5. भीमा — उजनी धरण. सोलापूर जिल्ह्याला पाणी.",
        keyPoints: [
          "गोदावरी ही महाराष्ट्रातील सर्वात मोठी नदी आहे.",
          "नदी पाणलोट क्षेत्र — नदीला पाणी देणारा भाग.",
          "धरणे — पाणी साठवण्यासाठी नदीवर बांधलेली रचना.",
          "नद्या सिंचनाचे प्रमुख साधन आहेत.",
        ],
        quiz: [
          { q: "महाराष्ट्रातील सर्वात मोठी नदी कोणती?", options: ["कृष्णा", "गोदावरी", "भीमा", "नर्मदा"], answer: 1, explanation: "गोदावरी ही महाराष्ट्रातील सर्वात मोठी नदी. तिला 'दक्षिण गंगा' म्हणतात." },
          { q: "गोदावरीचा उगम कोठे आहे?", options: ["पुणे", "नाशिक", "नागपूर", "मुंबई"], answer: 1, explanation: "गोदावरीचा उगम नाशिक जिल्ह्यातील त्र्यंबकेश्वर येथे आहे." },
          { q: "उजनी धरण कोणत्या नदीवर आहे?", options: ["गोदावरी", "कृष्णा", "भीमा", "तापी"], answer: 2, explanation: "उजनी (Ujani) धरण भीमा नदीवर सोलापूर जिल्ह्यात आहे." },
          { q: "नद्या शेतीसाठी का महत्त्वाच्या?", options: ["त्या सुंदर दिसतात", "त्या सिंचन पाणी देतात", "त्या मोठ्या असतात", "त्यात मासे असतात"], answer: 1, explanation: "नद्यांमुळे सिंचन शक्य होते — शेतीला पाणी मिळते." },
          { q: "महाबळेश्वर येथून कोणती नदी उगवते?", options: ["गोदावरी", "नर्मदा", "कृष्णा", "भीमा"], answer: 2, explanation: "कृष्णा नदीचा उगम महाबळेश्वर (सातारा) येथे आहे." },
        ],
        activity: {
          title: "नदी नकाशा",
          steps: [
            "महाराष्ट्राचा रिकामा नकाशा काढा.",
            "पाच नद्यांची ओळ काढा — वेगवेगळ्या रंगांनी.",
            "त्यांचे उगमस्थान आणि मुख्य शहरे चिन्हांकित करा.",
            "भिंतीवर लावा.",
          ],
        },
        project: {
          title: "आमची नदी सर्वेक्षण",
          description: "तुमच्या गावाजवळील नदीला भेट द्या. तिचे नाव, पाण्याची स्थिती, कोणत्या शेतांना फायदा होतो ते नोंदवा. फोटो काढा.",
        },
        has3D: true,
        threeDRoute: "/classroom/geography-lab",
      },
    ],
  },
];

// ============================================================
// FULL CLASS DATA
// ============================================================

const STUB_SUBJECT = (id: Subject, title: string, titleEn: string, color: string, bgColor: string, icon: string): SubjectData => ({
  id, title, titleEn, color, bgColor, icon,
  chapters: [
    { id: "ch1", title: "अध्याय १", titleEn: "Chapter 1", icon: "📖", topics: [] },
    { id: "ch2", title: "अध्याय २", titleEn: "Chapter 2", icon: "📖", topics: [] },
    { id: "ch3", title: "अध्याय ३", titleEn: "Chapter 3", icon: "📖", topics: [] },
  ],
});

export const CURRICULUM: ClassData[] = [
  // Class 1-4: Stubs
  ...([1, 2, 3, 4] as number[]).map(cls => ({
    id: cls,
    label: `इयत्ता ${cls === 1 ? "पहिली" : cls === 2 ? "दुसरी" : cls === 3 ? "तिसरी" : "चौथी"}`,
    ageRange: `${cls + 5}-${cls + 6} वर्षे`,
    isFullContent: false,
    subjects: [
      STUB_SUBJECT("mathematics", "गणित", "Mathematics", "text-blue-600", "bg-blue-50", "🔢"),
      STUB_SUBJECT("marathi", "मराठी", "Marathi", "text-orange-600", "bg-orange-50", "अ"),
      STUB_SUBJECT("english", "इंग्रजी", "English", "text-green-600", "bg-green-50", "A"),
      STUB_SUBJECT("science", "परिसर अभ्यास", "Environmental Science", "text-emerald-600", "bg-emerald-50", "🌿"),
    ],
  })),

  // Class 5: Full Mathematics, stub others
  {
    id: 5,
    label: "इयत्ता पाचवी",
    ageRange: "१०-११ वर्षे",
    isFullContent: true,
    subjects: [
      {
        id: "mathematics",
        title: "गणित",
        titleEn: "Mathematics",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: "🔢",
        chapters: math5Chapters,
      },
      STUB_SUBJECT("marathi", "मराठी", "Marathi", "text-orange-600", "bg-orange-50", "अ"),
      STUB_SUBJECT("english", "इंग्रजी", "English", "text-green-600", "bg-green-50", "A"),
      STUB_SUBJECT("science", "विज्ञान", "Science", "text-emerald-600", "bg-emerald-50", "🔬"),
      STUB_SUBJECT("social_science", "इतिहास-भूगोल", "Social Science", "text-amber-600", "bg-amber-50", "🗺️"),
    ],
  },

  // Class 6: Full Science, stub others
  {
    id: 6,
    label: "इयत्ता सहावी",
    ageRange: "११-१२ वर्षे",
    isFullContent: true,
    subjects: [
      STUB_SUBJECT("mathematics", "गणित", "Mathematics", "text-blue-600", "bg-blue-50", "🔢"),
      STUB_SUBJECT("marathi", "मराठी", "Marathi", "text-orange-600", "bg-orange-50", "अ"),
      STUB_SUBJECT("english", "इंग्रजी", "English", "text-green-600", "bg-green-50", "A"),
      {
        id: "science",
        title: "विज्ञान",
        titleEn: "Science",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        icon: "🔬",
        chapters: science6Chapters,
      },
      STUB_SUBJECT("social_science", "इतिहास-भूगोल", "Social Science", "text-amber-600", "bg-amber-50", "🗺️"),
    ],
  },

  // Class 7: Full Social Science, stub others
  {
    id: 7,
    label: "इयत्ता सातवी",
    ageRange: "१२-१३ वर्षे",
    isFullContent: true,
    subjects: [
      STUB_SUBJECT("mathematics", "गणित", "Mathematics", "text-blue-600", "bg-blue-50", "🔢"),
      STUB_SUBJECT("marathi", "मराठी", "Marathi", "text-orange-600", "bg-orange-50", "अ"),
      STUB_SUBJECT("english", "इंग्रजी", "English", "text-green-600", "bg-green-50", "A"),
      STUB_SUBJECT("science", "विज्ञान", "Science", "text-emerald-600", "bg-emerald-50", "🔬"),
      {
        id: "social_science",
        title: "इतिहास-भूगोल",
        titleEn: "Social Science",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        icon: "🗺️",
        chapters: socialScience7Chapters,
      },
    ],
  },

  // Class 8-10: Partial stubs
  ...([8, 9, 10] as number[]).map(cls => ({
    id: cls,
    label: `इयत्ता ${cls === 8 ? "आठवी" : cls === 9 ? "नववी" : "दहावी"}`,
    ageRange: `${cls + 5}-${cls + 6} वर्षे`,
    isFullContent: false,
    subjects: [
      STUB_SUBJECT("mathematics", "गणित", "Mathematics", "text-blue-600", "bg-blue-50", "🔢"),
      STUB_SUBJECT("marathi", "मराठी", "Marathi", "text-orange-600", "bg-orange-50", "अ"),
      STUB_SUBJECT("english", "इंग्रजी", "English", "text-green-600", "bg-green-50", "A"),
      STUB_SUBJECT("science", "विज्ञान", "Science", "text-emerald-600", "bg-emerald-50", "🔬"),
      STUB_SUBJECT("social_science", "इतिहास-भूगोल", "Social Science", "text-amber-600", "bg-amber-50", "🗺️"),
    ],
  })),
];

export function getClass(classId: number): ClassData | undefined {
  return CURRICULUM.find(c => c.id === classId);
}

export function getSubject(classId: number, subjectId: string): SubjectData | undefined {
  return getClass(classId)?.subjects.find(s => s.id === subjectId);
}

export function getChapter(classId: number, subjectId: string, chapterId: string): Chapter | undefined {
  return getSubject(classId, subjectId)?.chapters.find(c => c.id === chapterId);
}

export function getTopic(classId: number, subjectId: string, chapterId: string, topicId: string): Topic | undefined {
  return getChapter(classId, subjectId, chapterId)?.topics.find(t => t.id === topicId);
}

export const CLASS_ICONS: Record<number, string> = {
  1: "🌱", 2: "🌿", 3: "🍀", 4: "🌸", 5: "⭐",
  6: "🚀", 7: "🔭", 8: "⚡", 9: "🧬", 10: "🏆",
};

export const SUBJECT_COLORS: Record<Subject, { bg: string; text: string; border: string; gradient: string }> = {
  mathematics: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-200", gradient: "from-blue-500 to-indigo-600" },
  science: { bg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-600" },
  marathi: { bg: "bg-orange-500", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-500 to-amber-600" },
  english: { bg: "bg-green-500", text: "text-green-600", border: "border-green-200", gradient: "from-green-500 to-lime-600" },
  social_science: { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-200", gradient: "from-amber-500 to-orange-600" },
};

export interface SkillMapping {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export interface CareerMapping {
  title: string;
  path: string;
}

export interface ChapterJourneyDetails {
  summary: string;
  skills: SkillMapping[];
  careers: CareerMapping[];
}

export function getChapterJourneyDetails(chapterId: string): ChapterJourneyDetails {
  const dataMap: Record<string, ChapterJourneyDetails> = {
    fractions: {
      summary: "अूर्णांकाची मूलभूत ओळख, त्यांचे प्रकार, आणि व्यवहारातील भाग मोजणी शिकणे.",
      skills: [
        { id: "finance", name: "आर्थिक साक्षरता", nameEn: "Financial Literacy", icon: "Wallet" },
        { id: "digital", name: "डिजिटल साक्षरता", nameEn: "Digital Literacy", icon: "Laptop" }
      ],
      careers: [
        { title: "बँक व्यवस्थापक (Bank Manager)", path: "कॉमर्स पदवी -> वित्त नियोजन" },
        { title: "डेटा ॲनालिस्ट (Data Analyst)", path: "गणित पदवी -> डेटा विश्लेषण" }
      ]
    },
    decimals: {
      summary: "दशांश पद्धतीचे महत्त्व, बाजारातील हिशोब आणि विविध मापनांमध्ये दशांश संख्यांचा वापर.",
      skills: [
        { id: "finance", name: "आर्थिक साक्षरता", nameEn: "Financial Literacy", icon: "Wallet" }
      ],
      careers: [
        { title: "लेखापाल (Accountant)", path: "बी.कॉम -> कर सल्लागार" }
      ]
    },
    geometry: {
      summary: "विविध भौमितिक आकार, विशेषतः त्रिकोण आणि त्यांचे व्यावहारिक महत्त्व समजून घेणे.",
      skills: [
        { id: "entrepreneurship", name: "उद्योजकता", nameEn: "Entrepreneurship", icon: "Lightbulb" }
      ],
      careers: [
        { title: "स्थापत्य अभियंता (Civil Engineer)", path: "डिप्लोमा/डिग्री -> बांधकाम व्यवस्थापन" },
        { title: "आर्किटेक्ट (Architect)", path: "बी.आर्च -> डिझाईन कन्सल्टंट" }
      ]
    },
    "living-world": {
      summary: "सजीवांची प्रमुख वैशिष्ट्ये आणि आपल्या सभोवतालच्या निसर्गातील सजीव-निर्जीवांची ओळख.",
      skills: [
        { id: "ai", name: "AI साक्षरता", nameEn: "AI Literacy", icon: "Bot" }
      ],
      careers: [
        { title: "वनस्पतीशास्त्रज्ञ (Botanist)", path: "बी.एससी बॉटनी -> संशोधन" }
      ]
    },
    "human-body": {
      summary: "मानवी शरीराचे महत्त्वाचे अवयव, विशेषतः हृदय आणि मेंदू यांची रचना व कार्य समजणे.",
      skills: [
        { id: "digital", name: "डिजिटल साक्षरता", nameEn: "Digital Literacy", icon: "Laptop" }
      ],
      careers: [
        { title: "कार्डिओलॉजिस्ट (Cardiologist)", path: "एमबीबीएस -> एमडी कार्डिओलॉजी" },
        { title: "न्युरोलॉजिस्ट (Neurologist)", path: "एमबीबीएस -> न्युरोसायन्स" }
      ]
    },
    plants: {
      summary: "वनस्पतींमध्ये सूर्यप्रकाशापासून अन्न बनवण्याची प्रक्रिया (प्रकाशसंश्लेषण) आणि तिचे महत्त्व.",
      skills: [
        { id: "entrepreneurship", name: "उद्योजकता", nameEn: "Entrepreneurship", icon: "Lightbulb" }
      ],
      careers: [
        { title: "ॲग्रीटेक एक्सपर्ट (Agritech Specialist)", path: "कृषी पदवी -> स्मार्ट फार्मिंग" }
      ]
    },
    "maharashtra-geography": {
      summary: "महाराष्ट्राची भौगोलिक रचना, प्रमुख नद्या आणि खोऱ्यांची उपयुक्तता अभ्यासणे.",
      skills: [
        { id: "leadership", name: "नेतृत्व", nameEn: "Leadership", icon: "Crown" }
      ],
      careers: [
        { title: "पर्यावरण सल्लागार (Environmentalist)", path: "पर्यावरण विज्ञान -> एनजीओ संचालक" }
      ]
    }
  };

  return dataMap[chapterId] || {
    summary: "या पाठाची ओळख आणि त्यातील विविध संकल्पनांचा अभ्यास करणे.",
    skills: [
      { id: "digital", name: "डिजिटल साक्षरता", nameEn: "Digital Literacy", icon: "Laptop" }
    ],
    careers: [
      { title: "शिक्षक (Teacher / Educator)", path: "पदवी -> डी.एल.एड / बी.एड" }
    ]
  };
}
