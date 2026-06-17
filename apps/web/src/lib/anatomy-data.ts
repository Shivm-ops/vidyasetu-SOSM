export interface AnatomyNode {
  id: string;
  name: string;
  scientificName: string;
  location: string;
  function: string;
  importance: string;
  relatedSystems: string[];
  commonDiseases: string[];
  preventionTips: string[];
  interestingFacts: string[];
  aiExplanation: string;
  villageExample: string;
  activities: { title: string; desc: string }[];
  quizzes: { question: string; options: string[]; answer: number }[];
  careers: { title: string; path: string }[];
}

export const anatomyData: Record<string, AnatomyNode> = {
  body: {
    id: "body",
    name: "मानवी शरीर (Human Body)",
    scientificName: "Homo Sapiens Anatomy",
    location: "संपूर्ण शरीर",
    function: "सर्व अवयवांचे संरक्षण करणे आणि हालचाल करणे.",
    importance: "मानवी शरीर हे निसर्गातील सर्वात गुंतागुंतीचे आणि प्रगत यंत्र आहे.",
    relatedSystems: ["स्नायू संस्था (Muscular)", "अस्थी संस्था (Skeletal)", "त्वचा संस्था (Integumentary)"],
    commonDiseases: ["अशक्तपणा", "हाडांची झीज"],
    preventionTips: ["नियमित व्यायाम", "समतोल आहार", "स्वच्छता"],
    interestingFacts: ["मानवी शरीरात २०६ हाडे आणि ६०० पेक्षा जास्त स्नायू असतात.", "त्वचा हा शरीरातील सर्वात मोठा अवयव आहे."],
    aiExplanation: "मानवी शरीर हे एका मोठ्या कारखान्यासारखे आहे जिथे प्रत्येक अवयव आपला स्वतंत्र विभाग सांभाळतो.",
    villageExample: "जसा एखादा वाडा किंवा घर विटा, लाकूड आणि सिमेंटने भक्कम उभा असतो, तसाच आपला सांगाडा आणि स्नायू शरीराला भक्कम आधार देतात.",
    activities: [
      { title: "BMI मोजणे", desc: "तुमचे वजन आणि उंची मोजून तुमचा BMI (Body Mass Index) काढा." }
    ],
    quizzes: [
      { question: "प्रौढ मानवी शरीरात एकूण किती हाडे असतात?", options: ["१५०", "२०६", "३००", "३५०"], answer: 1 }
    ],
    careers: [
      { title: "Physiotherapist", path: "12th Science -> BPT" },
      { title: "Orthopedic Surgeon", path: "12th -> MBBS -> MS Ortho" }
    ]
  },
  heart: {
    id: "heart",
    name: "हृदय (Heart)",
    scientificName: "Cor",
    location: "छातीच्या मध्यभागी, थोडे डावीकडे",
    function: "संपूर्ण शरीरात रक्त पंप करणे आणि ऑक्सिजन पोहोचवणे.",
    importance: "हृदय बंद पडल्यास शरीराला ऑक्सिजन मिळत नाही, ज्यामुळे जीव जाऊ शकतो.",
    relatedSystems: ["रक्ताभिसरण संस्था (Circulatory System)"],
    commonDiseases: ["हृदयविकाराचा झटका (Heart Attack)", "उच्च रक्तदाब (Hypertension)"],
    preventionTips: ["रोज व्यायाम करा", "तेलकट पदार्थ टाळा", "ताणतणाव कमी करा"],
    interestingFacts: ["हृदय दिवसातून सुमारे १ लाख वेळा धडकते.", "हृदय शरीराबाहेरही धडकू शकते जर त्याला ऑक्सिजन मिळत राहिला."],
    aiExplanation: "हृदय हे एका मोटर पंप प्रमाणे काम करते. जसे शेतात पाणी देण्यासाठी आपण पंप वापरतो, तसाच हृदय पंप शरीराच्या प्रत्येक अवयवापर्यंत रक्त आणि ऑक्सिजन पोहोचवतो.",
    villageExample: "गावातल्या विहिरीवरची पाण्याची मोटर जशी संपूर्ण शेताला पाईपद्वारे पाणी पुरवते, तसेच हृदय आपल्या शरीराच्या नसांमधून (पाईप्स) रक्त पुरवते.",
    activities: [
      { title: "नाडी मोजणे (Pulse Rate)", desc: "तुमच्या मनगटावर बोटे ठेवून १ मिनिटात किती ठोके पडतात ते मोजा." },
      { title: "व्यायामानंतरचा बदल", desc: "५ मिनिटे धावून आल्यावर परत हृदयाचे ठोके मोजा आणि फरक नोंदवा." }
    ],
    quizzes: [
      { question: "हृदय दिवसातून साधारण किती वेळा धडकते?", options: ["१०,००० वेळा", "१ लाख वेळा", "५०,००० वेळा", "५ लाख वेळा"], answer: 1 },
      { question: "हृदय कोणत्या संस्थेचा भाग आहे?", options: ["पचनसंस्था", "श्वसनसंस्था", "रक्ताभिसरण संस्था", "चेजासंस्था"], answer: 2 }
    ],
    careers: [
      { title: "Cardiologist (हृदयविकार तज्ज्ञ)", path: "12th Science -> MBBS -> MD Medicine -> DM Cardiology" },
      { title: "Cardiac Surgeon", path: "12th Science -> MBBS -> MS Surgery -> MCh CVTS" }
    ]
  },
  lungs: {
    id: "lungs",
    name: "फुफ्फुसे (Lungs)",
    scientificName: "Pulmones",
    location: "छातीच्या पिंजऱ्यात, हृदयाच्या दोन्ही बाजूला",
    function: "हवेतून ऑक्सिजन घेणे आणि शरीरातील कार्बन डायऑक्साइड बाहेर टाकणे.",
    importance: "ऑक्सिजनशिवाय पेशी ऊर्जा निर्माण करू शकत नाहीत.",
    relatedSystems: ["श्वसनसंस्था (Respiratory System)"],
    commonDiseases: ["दमा (Asthma)", "निमोनिया (Pneumonia)", "टीबी (Tuberculosis)"],
    preventionTips: ["धूम्रपान टाळा", "प्रदूषणापासून संरक्षण करा", "प्राणायाम करा"],
    interestingFacts: ["उजवे फुफ्फुस डाव्या फुफ्फुसापेक्षा थोडे मोठे असते.", "फुफ्फुसे पाण्यात तरंगू शकणारा शरीरातील एकमेव अवयव आहे."],
    aiExplanation: "फुफ्फुसे म्हणजे दोन मोठे फुगे आहेत. जेव्हा आपण श्वास घेतो तेव्हा ते हवेने भरतात, आणि श्वास सोडताना आकुंचन पावतात.",
    villageExample: "चुलीत फुंकणीने हवा मारल्यावर जशी आग भडकते, तसेच फुफ्फुसे शरीराच्या इंजिनला (पेशींना) ऑक्सिजन देऊन ऊर्जा निर्माण करतात.",
    activities: [
      { title: "फुग्याचा प्रयोग", desc: "एका दमात तुम्ही फुगा किती मोठा फुगवू शकता ते मोजा. ही तुमची फुफ्फुसांची क्षमता आहे." },
      { title: "श्वास रोखणे", desc: "सुरक्षित वातावरणात तुम्ही किती सेकंद श्वास रोखू शकता ते तपासा." }
    ],
    quizzes: [
      { question: "फुफ्फुसे कोणता वायू शरीरात घेतात?", options: ["ऑक्सिजन", "कार्बन डायऑक्साइड", "नायट्रोजन", "हायड्रोजन"], answer: 0 }
    ],
    careers: [
      { title: "Pulmonologist", path: "12th Science -> MBBS -> MD Pulmonology" },
      { title: "Respiratory Therapist", path: "12th -> BSc Respiratory Therapy" }
    ]
  },
  brain: {
    id: "brain",
    name: "मेंदू (Brain)",
    scientificName: "Encephalon",
    location: "डोक्याच्या कवटीमध्ये",
    function: "विचार करणे, आठवण ठेवणे, शरीराचे नियंत्रण करणे.",
    importance: "शरीराचा 'CPU' जो सर्व हालचाली आणि विचारांवर नियंत्रण ठेवतो.",
    relatedSystems: ["मज्जासंस्था (Nervous System)"],
    commonDiseases: ["अल्झायमर (Alzheimer's)", "मायग्रेन (Migraine)"],
    preventionTips: ["पुरेशी झोप घ्या", "बुद्धीबळ खेळा", "हेल्मेट वापरा"],
    interestingFacts: ["मेंदू शरीरातील २०% ऑक्सिजन आणि ऊर्जा वापरतो.", "मेंदूमध्ये वेदना जाणवणारी नस नसते (Brain feels no pain)."],
    aiExplanation: "मेंदू हा सुपर कॉम्प्युटर आहे जो शरीराच्या प्रत्येक भागाला संदेश पाठवतो.",
    villageExample: "जसा ग्रामपंचायतीचा सरपंच पूर्ण गावाचे नियंत्रण करतो आणि निर्णय घेतो, तसाच मेंदू पूर्ण शरीराचा सरपंच आहे.",
    activities: [
      { title: "स्मरणशक्ती खेळ", desc: "१० वस्तू पाहून त्या १ मिनिटात किती लक्षात राहतात ते तपासा." }
    ],
    quizzes: [
      { question: "मेंदू शरीरातील किती टक्के ऊर्जा वापरतो?", options: ["५%", "१०%", "२०%", "५०%"], answer: 2 }
    ],
    careers: [
      { title: "Neurologist (मेंदू विकार तज्ज्ञ)", path: "12th Science -> MBBS -> MD -> DM Neurology" },
      { title: "Neurosurgeon", path: "12th -> MBBS -> MS -> MCh Neurosurgery" }
    ]
  },
  stomach: {
    id: "stomach",
    name: "पचनसंस्था (Digestive)",
    scientificName: "Gaster / Intestinum",
    location: "पोटाच्या भागात",
    function: "खाल्लेल्या अन्नाचे पचन करणे आणि ऊर्जा तयार करणे.",
    importance: "अन्नातील पोषक घटक शरीराला मिळवून देते.",
    relatedSystems: ["पचनसंस्था (Digestive System)"],
    commonDiseases: ["अॅसिडिटी (Acidity)", "अल्सर (Ulcer)"],
    preventionTips: ["वेळेवर जेवण करा", "बाहेरचे उघडे अन्न खाऊ नका", "भरपूर पाणी प्या"],
    interestingFacts: ["पोटात इतके जहाल आम्ल (Acid) असते की ते ब्लेड सुद्धा वितळवू शकते."],
    aiExplanation: "पोट हे एक मिक्सर-ग्राइंडर आहे जे अन्नाचे बारीक तुकडे करून त्याची पेस्ट बनवते.",
    villageExample: "जसे आपण जात्यावर दळण दळतो किंवा पिठाच्या गिरणीत गहू दळून त्याचे पीठ होते, तसेच पोट अन्नाचे दळण करून ऊर्जा बनवते.",
    activities: [
      { title: "अन्न पचन नोंद", desc: "कोणते अन्न पचायला हलके आहे आणि कशामुळे जड वाटते याची नोंद ठेवा." }
    ],
    quizzes: [
      { question: "पोटातील आम्ल (Acid) कोणते असते?", options: ["हायड्रोक्लोरिक आम्ल (HCl)", "सल्फ्युरिक आम्ल", "सायट्रिक आम्ल", "लॅक्टिक आम्ल"], answer: 0 }
    ],
    careers: [
      { title: "Gastroenterologist", path: "12th Science -> MBBS -> MD -> DM Gastroenterology" },
      { title: "Dietitian (आहारतज्ज्ञ)", path: "12th Science -> BSc Nutrition -> MSc" }
    ]
  }
};
