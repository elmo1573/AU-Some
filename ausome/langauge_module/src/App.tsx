import React, { useState, useEffect } from 'react';
import { LanguageCode, VocabularyItem, UserState } from './types';
import { LANGUAGE_PACKS, SUPPORTED_LANGUAGES, REWARD_SHOP_ITEMS, REAL_WORLD_PRACTICE_CHECKLIST } from './languages/data';
import { speakText, playSensoryChime } from './utils/speech';

// Import sub-modules
import AACCommunication from './components/AACCommunication';
import VocabularyBanks from './components/VocabularyBanks';
import SentenceBuilder from './components/SentenceBuilder';
import SocialCommunication from './components/SocialCommunication';
import ListeningDirections from './components/ListeningDirections';
import MontessoriShop from './components/MontessoriShop';
import LearnAndEarn from './components/LearnAndEarn';
import ParentDashboard from './components/ParentDashboard';

// Import newly created games
import SpellingBuilderGame from './components/SpellingBuilderGame';
import PictureSelectionGame from './components/PictureSelectionGame';
import SoundMatcherGame from './components/SoundMatcherGame';
import MissingWordGame from './components/MissingWordGame';

import { 
  Volume2, Ear, Trophy, ShieldCheck, Heart, Sparkles, BookOpen, 
  Smile, MessageSquare, Globe, ArrowLeft, CheckCircle, ChevronRight, Settings,
  Sparkle, ShoppingBag, LayoutDashboard, User, Award, Printer, Lock
} from 'lucide-react';
import HubLinkBar from '@shared/HubLinkBar';
import {
  hydrateProfileFromApi,
  loadModuleData,
  saveModuleData,
} from '@shared/profile-client';

const NAV_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    continueLearning: "Continue Learning",
    configSetup: "Choose Language & Setup",
    parentDashboard: "Parent & Caregiver Menu",
    welcomeJourney: "Welcome to Your Journey!",
    milestoneMap: "Milestone Journey Map",
    launchAstrocade: "⚡ Launch Astrocade Blitz",
    certificateUnlocked: "Certificate Unlocked!",
    personalizeCertificate: "Enter Child's Name to Personalize:",
    claimReward: "Claim & Save Reward",
    lessonComplete: "Lesson Complete!",
    nextLevel: "Unlock Next Level",
    backToJourney: "Back to Journey Map",
    childLevel: "Child's Starting Point Profile:",
    playhouse: "Avatar Playhouse",
    materials: "Montessori Materials",
    parentInsights: "Parent Insights",
    selectLanguage: "Language Selection",
    taughtInLabel: "Taught in (Instruction Language)",
    learningLabel: "Learning (Target Language)",
    setupDesc: "Autistic children benefit from predictability. Select an instruction language to translate dashboards & games, and the target language to practice speaking.",
    profileBeginning: "Beginning Communicator",
    profileBeginningDesc: "Focuses on expressing basic needs using tactile visual aids & basic AAC gestures.",
    profileEmerging: "Emerging Communicator",
    profileEmergingDesc: "Focuses on single word vocabularies, animal sounds, and visual object matching.",
    profileGrowing: "Growing Communicator",
    profileGrowingDesc: "Focuses on combining words into short sentence blocks and simple social scenarios.",
    profileIndependent: "Independent Communicator",
    profileIndependentDesc: "Focuses on advanced conversation simulation, spelling, and listening comprehension.",
    saveConfig: "Save Configuration",
    taskbarHome: "Portal Hub",
    taskbarPlayhouse: "Playhouse",
    taskbarMaterials: "Materials",
    taskbarDashboard: "Dashboard"
  },
  es: {
    continueLearning: "Continuar Aprendiendo",
    configSetup: "Elegir Idioma y Configuración",
    parentDashboard: "Menú de Padres y Cuidadores",
    welcomeJourney: "¡Bienvenido a tu viaje!",
    milestoneMap: "Mapa de Hitos de Aprendizaje",
    launchAstrocade: "⚡ Iniciar Astrocade Rápido",
    certificateUnlocked: "¡Certificado Desbloqueado!",
    personalizeCertificate: "Ingresa el nombre del niño:",
    claimReward: "Reclamar y Guardar Premio",
    lessonComplete: "¡Lección Completada!",
    nextLevel: "Desbloquear Siguiente Nivel",
    backToJourney: "Volver al Mapa",
    childLevel: "Perfil inicial del niño:",
    playhouse: "Playhouse del Avatar",
    materials: "Materiales Montessori",
    parentInsights: "Perspectivas de Padres",
    selectLanguage: "Selección de Idiomas",
    taughtInLabel: "Se te enseña en (Instrucción)",
    learningLabel: "Aprendiendo (Idioma Objetivo)",
    setupDesc: "Los niños autistas se benefician de la previsibilidad. Selecciona un idioma de instrucción y el idioma objetivo para practicar.",
    profileBeginning: "Comunicador Principiante",
    profileBeginningDesc: "Se enfoca en expresar necesidades básicas usando ayudas visuales táctiles y gestos simples de AAC.",
    profileEmerging: "Comunicador Emergente",
    profileEmergingDesc: "Se enfoca en vocabularios de una sola palabra, sonidos de animales y emparejamiento visual.",
    profileGrowing: "Comunicador en Crecimiento",
    profileGrowingDesc: "Se enfoca en combinar palabras en bloques de oraciones cortas y escenarios sociales simples.",
    profileIndependent: "Comunicador Independiente",
    profileIndependentDesc: "Se enfoca en simulaciones de conversación avanzadas, ortografía y comprensión auditiva.",
    saveConfig: "Guardar Configuración",
    taskbarHome: "Portal",
    taskbarPlayhouse: "Playhouse",
    taskbarMaterials: "Materiales",
    taskbarDashboard: "Panel"
  },
  de: {
    continueLearning: "Weiterlernen",
    configSetup: "Sprache & Profil wählen",
    parentDashboard: "Eltern- & Betreuer-Menü",
    welcomeJourney: "Willkommen auf deiner Reise!",
    milestoneMap: "Meilenstein-Reisekarte",
    launchAstrocade: "⚡ Astrocade Blitz starten",
    certificateUnlocked: "Zertifikat freigeschaltet!",
    personalizeCertificate: "Name des Kindes eingeben:",
    claimReward: "Belohnung beanspruchen",
    lessonComplete: "Lektion beendet!",
    nextLevel: "Nächstes Level freischalten",
    backToJourney: "Zurück zur Reisekarte",
    childLevel: "Startpunkt-Profil des Kindes:",
    playhouse: "Avatar-Spielhaus",
    materials: "Montessori-Materialien",
    parentInsights: "Eltern-Dashboard",
    selectLanguage: "Sprachauswahl",
    taughtInLabel: "Unterrichtet in (Anleitung)",
    learningLabel: "Lernen (Zielsprache)",
    setupDesc: "Autistische Kinder profitieren von Vorhersehbarkeit. Wählen Sie die Anleitungssprache und die zu lernende Zielsprache.",
    profileBeginning: "Anfänger-Kommunikator",
    profileBeginningDesc: "Fokus auf grundlegende Bedürfnisse mit taktilen Hilfsmitteln und einfachem AAC.",
    profileEmerging: "Aufstrebender Kommunikator",
    profileEmergingDesc: "Fokus auf einzelne Wörter, Tierstimmen und visuelle Zuordnungen.",
    profileGrowing: "Wachsender Kommunikator",
    profileGrowingDesc: "Fokus auf Wortkombinationen und einfache soziale Szenarien.",
    profileIndependent: "Unabhängiger Kommunikator",
    profileIndependentDesc: "Fokus auf fortgeschrittene Konversationen, Rechtschreibung und Verständnis.",
    saveConfig: "Konfiguration speichern",
    taskbarHome: "Portal Hub",
    taskbarPlayhouse: "Spielhaus",
    taskbarMaterials: "Materialien",
    taskbarDashboard: "Dashboard"
  },
  zh: {
    continueLearning: "继续学习",
    configSetup: "语言与档案设置",
    parentDashboard: "家长与看护人中心",
    welcomeJourney: "欢迎开启你的学习之旅！",
    milestoneMap: "里程碑学习路线图",
    launchAstrocade: "⚡ 开启闪电游乐场",
    certificateUnlocked: "获得荣誉证书！",
    personalizeCertificate: "请输入孩子姓名：",
    claimReward: "领奖并保存",
    lessonComplete: "课程完成！",
    nextLevel: "解锁下一关",
    backToJourney: "返回路线图",
    childLevel: "孩子学习起点：",
    playhouse: "装扮小屋",
    materials: "蒙氏教具",
    parentInsights: "家长反馈",
    selectLanguage: "语言设置",
    taughtInLabel: "提示语言 (母语)",
    learningLabel: "学习语言 (目标语言)",
    setupDesc: "自闭症儿童喜欢预测与掌控感。选择提示语言来翻译界面，选择目标语言来练习发音与沟通。",
    profileBeginning: "初级沟通者",
    profileBeginningDesc: "专注于使用基础触觉视觉教具和基础 AAC 手势表达基本生理和心理需求。",
    profileEmerging: "中级沟通者",
    profileEmergingDesc: "专注于单字核心词汇、动物叫声和直观的图形及卡片配对游戏。",
    profileGrowing: "高级沟通者",
    profileGrowingDesc: "专注于短句积木拼接组合、完成填空以及简单的社交场景对话练习。",
    profileIndependent: "独立沟通者",
    profileIndependentDesc: "专注于复杂的社交情景模拟、拼写闯关以及多步骤的听力理解训练。",
    saveConfig: "保存并开启旅程",
    taskbarHome: "大厅",
    taskbarPlayhouse: "装扮小屋",
    taskbarMaterials: "蒙氏教具",
    taskbarDashboard: "家长中心"
  },
  ar: {
    continueLearning: "متابعة التعلم",
    configSetup: "اختر اللغة والملف",
    parentDashboard: "قائمة أولياء الأمور",
    welcomeJourney: "مرحباً بك في رحلتك!",
    milestoneMap: "خريطة رحلة الإنجازات",
    launchAstrocade: "⚡ إطلاق ألعاب أستروكاد السريعة",
    certificateUnlocked: "تم فتح الشهادة!",
    personalizeCertificate: "أدخل اسم الطفل لتخصيص الشهادة:",
    claimReward: "طالب بالجائزة واحفظها",
    lessonComplete: "اكتمل الدرس!",
    nextLevel: "فتح المستوى التالي",
    backToJourney: "العودة إلى خريطة الرحلة",
    childLevel: "مستوى البداية للطفل:",
    playhouse: "الملعب الصغير",
    materials: "حقيبة المواد",
    parentInsights: "لوحة المتابعة",
    selectLanguage: "إعدادات اللغة",
    taughtInLabel: "لغة التعليم (اللغة الأم)",
    learningLabel: "لغة التعلم (اللغة الهدف)",
    setupDesc: "يستفيد الأطفال ذوو التوحد من القدرة على التنبؤ. اختر لغة التعليم لتوجيهات اللوحة، ولغة التعلم لممارسة النطق.",
    profileBeginning: "متواصل مبتدئ",
    profileBeginningDesc: "يركز على التعبير عن الاحتياجات الأساسية باستخدام الوسائل البصرية الحسيّة وبطاقات AAC.",
    profileEmerging: "متواصل ناشئ",
    profileEmergingDesc: "يركز على الكلمات المنفردة، أصوات الحيوانات، والمطابقة البصرية للعناصر.",
    profileGrowing: "متواصل نامٍ",
    profileGrowingDesc: "يركز على دمج الكلمات لتركيب جمل مفيدة قصيرة وحل التحديات الاجتماعية البسيطة.",
    profileIndependent: "متواصل مستقل",
    profileIndependentDesc: "يركز على المحادثات المتقدمة، الإملاء وتهجئة الكلمات، والاستماع والاستيعاب.",
    saveConfig: "حفظ الإعدادات",
    taskbarHome: "البوابة الرئيسية",
    taskbarPlayhouse: "الملعب الصغير",
    taskbarMaterials: "حقيبة المواد",
    taskbarDashboard: "لوحة المتابعة"
  }
};

interface CurriculumLevel {
  id: number;
  stageId: number;
  stageName: string;
  colorClass: string;
  name: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  emoji: string;
}

const LEVELS_DB: CurriculumLevel[] = [
  {
    id: 1,
    stageId: 1,
    stageName: "Stage 1: Communication First",
    colorClass: "bg-[#EBF3F5] border-[#D0E3E6] hover:bg-[#DEEAEC] text-[#225862]",
    name: {
      en: "AAC Core Board Explorer",
      es: "Explorador de Tablero AAC",
      de: "UK-Kommunikation Entdecker",
      zh: "AAC 沟通体验官",
      ar: "مستكشف لوحة AAC"
    },
    description: {
      en: "Tap giant buttons on the board to express 3 immediate needs.",
      es: "Toca botones gigantes para expresar 3 necesidades inmediatas.",
      de: "Tippe auf Riesentasten, um 3 Bedürfnisse auszudrücken.",
      zh: "点击大按钮，在核心辅助板上发出3种表达需求的声音。",
      ar: "اضغط على الأزرار العملاقة للتعبير عن 3 احتياجات عاجلة."
    },
    emoji: "🗣️"
  },
  {
    id: 2,
    stageId: 1,
    stageName: "Stage 1: Communication First",
    colorClass: "bg-[#EBF3F5] border-[#D0E3E6] hover:bg-[#DEEAEC] text-[#225862]",
    name: {
      en: "Visual Picture Matching",
      es: "Emparejamiento Visual",
      de: "Visuelle Bildzuordnung",
      zh: "图形配对连连看",
      ar: "مطابقة الصور البصرية"
    },
    description: {
      en: "Match spoken target words to their corresponding picture cards 3 times.",
      es: "Empareja palabras habladas con sus tarjetas de imágenes 3 veces.",
      de: "Ordne gesprochene Wörter 3 Mal den passenden Bildern zu.",
      zh: "听清念出的单词，并选出对应的卡片。完成3次配对。",
      ar: "طابق الكلمات المنطوقة مع بطاقات الصور المقابلة لها 3 مرات."
    },
    emoji: "🖼️"
  },
  {
    id: 3,
    stageId: 2,
    stageName: "Stage 2: Vocabulary Builder",
    colorClass: "bg-[#F0F4EE] border-[#DBE4D7] hover:bg-[#E5EEE1] text-[#415A37]",
    name: {
      en: "Tactile Flip Book Safari",
      es: "Safari de Libro Táctil",
      de: "Taktiles Flip-Book Safari",
      zh: "触觉单词翻页书",
      ar: "سفاري كتاب الكلمات التفاعلي"
    },
    description: {
      en: "Flip through 3 vocabulary cards. Listen to phonetic spelling and sounds.",
      es: "Hojea 3 tarjetas de vocabulario. Escucha sonidos y fonética.",
      de: "Blättere durch 3 Wortschatzkarten. Höre Aussprache und Phonetik.",
      zh: "滑动翻阅3个核心单词卡片，仔细听出发音嘴型、拼写与配套练习句子。",
      ar: "تصفح 3 بطاقات مفردات واكتشف نطقها الصوتي الدقيق."
    },
    emoji: "📚"
  },
  {
    id: 4,
    stageId: 2,
    stageName: "Stage 2: Vocabulary Builder",
    colorClass: "bg-[#F0F4EE] border-[#DBE4D7] hover:bg-[#E5EEE1] text-[#415A37]",
    name: {
      en: "Animal Sound Safari",
      es: "Safari de Sonidos de Animales",
      de: "Tierstimmen-Safari",
      zh: "神奇动物声效配对",
      ar: "سفاري الأصوات والحيوانات"
    },
    description: {
      en: "Listen to animal sounds or names, and match 3 correct animals.",
      es: "Escucha sonidos de animales y empareja 3 animales correctos.",
      de: "Höre Tierstimmen und ordne 3 Mal das richtige Tier zu.",
      zh: "听音辨物！点击大耳朵，仔细倾听大自然的声音并找出正确动物。",
      ar: "استمع إلى أصوات الحيوانات وطابق 3 منها بشكل صحيح."
    },
    emoji: "🎵"
  },
  {
    id: 5,
    stageId: 3,
    stageName: "Stage 3: Sentence Architect",
    colorClass: "bg-[#FAF1EB] border-[#ECCEC1] hover:bg-[#F5E5DC] text-[#7A3F26]",
    name: {
      en: "Sentence Block Builder",
      es: "Constructor de Bloques de Oraciones",
      de: "Satzbaustein-Kasten",
      zh: "语法卡片搭积木",
      ar: "مركب قوالب الجمل"
    },
    description: {
      en: "Snap block trays together to build and speak 3 complete phrases.",
      es: "Une bloques para construir y pronunciar 3 frases completas.",
      de: "Setze Bausteine zusammen, um 3 vollständige Sätze zu bilden.",
      zh: "拖动搭配主谓宾卡片积木，完整拼出3句带有自主意识的能发声的句子。",
      ar: "رتب قوالب الكلمات معاً لتكوين ونطق 3 جمل مفيدة."
    },
    emoji: "💬"
  },
  {
    id: 6,
    stageId: 3,
    stageName: "Stage 3: Sentence Architect",
    colorClass: "bg-[#FAF1EB] border-[#ECCEC1] hover:bg-[#F5E5DC] text-[#7A3F26]",
    name: {
      en: "Picture Story Fill-In",
      es: "Completar la Historia Visual",
      de: "Bildgeschichte Lückentext",
      zh: "看图说话填空挑战",
      ar: "إكمال القصة المصورة"
    },
    description: {
      en: "Solve 3 story cards by placing the correct missing word brick.",
      es: "Resuelve 3 tarjetas colocando el bloque de palabra correcto.",
      de: "Löse 3 Bilderrätsel durch Einsetzen des richtigen Wortbausteins.",
      zh: "根据图画展示的故事意境，找出最合理的卡片填入空白。完成3关。",
      ar: "حل 3 قصص مصورة بوضع قالب الكلمة الناقصة المناسب."
    },
    emoji: "🧩"
  },
  {
    id: 7,
    stageId: 4,
    stageName: "Stage 4: Social Connector",
    colorClass: "bg-[#F0F0FA] border-[#D6D6F0] hover:bg-[#E3E3F5] text-[#40407A]",
    name: {
      en: "Cozy Restaurant Ordering",
      es: "Pedir Comida en el Restaurante",
      de: "Gemütliche Restaurant-Bestellung",
      zh: "温馨餐厅点餐演练",
      ar: "طلب الطعام في مطعم مريح"
    },
    description: {
      en: "Roleplay with Pip to order sweet food, pay with wooden coins, and say thanks.",
      es: "Pide comida, paga con monedas de madera y di gracias con Pip.",
      de: "Bestelle Essen, bezahle mit Holzmünzen und bedanke dich mit Pip.",
      zh: "与小狐狸 Pip 开展模拟互动，练习进入餐厅、自主点餐、付账和说谢谢。",
      ar: "تبادل الأدوار مع Pip لطلب الطعام، والدفع بالعملات الخشبية، وقول شكراً."
    },
    emoji: "🍕"
  },
  {
    id: 8,
    stageId: 4,
    stageName: "Stage 4: Social Connector",
    colorClass: "bg-[#F0F0FA] border-[#D6D6F0] hover:bg-[#E3E3F5] text-[#40407A]",
    name: {
      en: "Playground Turn-Taking",
      es: "Compartir en el Parque de Juegos",
      de: "Spielplatz-Abwechseln",
      zh: "游乐场交替轮流练习",
      ar: "المشاركة وتبادل الأدوار في الملعب"
    },
    description: {
      en: "Learn social greetings, choose toys, share, and communicate finished states.",
      es: "Aprende saludos, elige juguetes y comunica cuando terminas.",
      de: "Lerne Begrüßungen, wähle Spielzeug und spiele abwechselnd.",
      zh: "跟熊猫 Sammy 一起去公园，练习打招呼、轮流玩玩具以及如何礼貌结束游戏。",
      ar: "تعلم التحية الاجتماعية، واختيار الألعاب، والمشاركة في الحديقة."
    },
    emoji: "🪁"
  },
  {
    id: 9,
    stageId: 5,
    stageName: "Stage 5: Language Master",
    colorClass: "bg-[#FAF8ED] border-[#EADAC2] hover:bg-[#F5EDDD] text-[#7D5A2E]",
    name: {
      en: "Spelling Tile Builder",
      es: "Constructor de Ortografía",
      de: "Rechtschreibungs-Kasten",
      zh: "字母磁贴单词拼写",
      ar: "تهجئة وبناء الكلمات"
    },
    description: {
      en: "Arrange scrambled tactile letter tiles to spell 3 target words correctly.",
      es: "Organiza fichas de letras para deletrear 3 palabras de forma correcta.",
      de: "Ordne durcheinandergewürfelte Buchstabenkarten, um 3 Wörter zu legen.",
      zh: "拖动打乱的字母瓷贴重新排列出卡片单词，拼出声音。完成3个单词拼写。",
      ar: "رتب مغناطيسات الحروف المبعثرة لتهجئة 3 كلمات بشكل صحيح."
    },
    emoji: "✏️"
  },
  {
    id: 10,
    stageId: 5,
    stageName: "Stage 5: Language Master",
    colorClass: "bg-[#FAF8ED] border-[#EADAC2] hover:bg-[#F5EDDD] text-[#7D5A2E]",
    name: {
      en: "Comprehension & Directions",
      es: "Comprensión y Direcciones",
      de: "Verständnis & Richtungsanweisungen",
      zh: "听音辨位方向指令",
      ar: "الاستماع والاستيعاب وتوجيهات"
    },
    description: {
      en: "Follow auditory-only and space instructions across 3 different stages.",
      es: "Sigue instrucciones puramente auditivas en 3 niveles.",
      de: "Folge rein auditiven Anweisungen über 3 Schwierigkeitsgrade.",
      zh: "纯听声音指令，不看提示。在全屏幕卡片中找出声音描述的对端。通关3轮。",
      ar: "اتبع التعليمات الصوتية الصامتة والاتجاهات عبر 3 مراحل."
    },
    emoji: "👂"
  }
];

export default function App() {
  // 1. Core State
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [instructionLanguage, setInstructionLanguage] = useState<LanguageCode>('en');
  
  const [stars, setStars] = useState<number>(15);
  const [coins, setCoins] = useState<number>(25);
  const [streak, setStreak] = useState<number>(3);
  
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [aacUsageCount, setAacUsageCount] = useState<Record<string, number>>({});
  const [completedRealWorldChecklist, setCompletedRealWorldChecklist] = useState<string[]>([]);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);
  
  const [avatar, setAvatar] = useState({ hat: '', outfit: '', decor: '🪴', faceColor: '#FAF5EB', expression: '😊' });
  const [aacTheme, setAacTheme] = useState<'classic' | 'warm-cream' | 'pastel-blue' | 'soft-lavender'>('warm-cream');
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<string[]>(['r_bonsai', 'r_lavender_theme']);
  
  const [voicePack, setVoicePack] = useState<string>('natural');

  // NEW Guided Journey state
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [childProfile, setChildProfile] = useState<'beginning' | 'emerging' | 'growing' | 'independent' | null>(null);
  const [setupCompleted, setSetupCompleted] = useState<boolean>(false);

  // Active view: home, setup, parent-menu, playhouse, materials, lesson-active, astrocade
  const [activeView, setActiveView] = useState<'home' | 'setup' | 'parent-menu' | 'playhouse' | 'materials' | 'lesson-active' | 'astrocade'>('home');

  // Interactive popup variables
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [lessonGoalCount, setLessonGoalCount] = useState<number>(0);
  const [showPayoutOverlay, setShowPayoutOverlay] = useState<boolean>(false);
  const [earnedCoinsAnim, setEarnedCoinsAnim] = useState<number>(0);
  const [earnedStarsAnim, setEarnedStarsAnim] = useState<number>(0);

  // Stage Certificate display states
  const [unlockedCertificateStage, setUnlockedCertificateStage] = useState<number | null>(null);
  const [certificateChildName, setCertificateChildName] = useState<string>('');

  // Astrocade active game states
  const [activeBlitzGame, setActiveBlitzGame] = useState<'match' | 'sound' | 'spell' | null>(null);
  const [blitzScore, setBlitzScore] = useState<number>(0);
  const [blitzTimer, setBlitzTimer] = useState<number>(30);
  const [showBlitzCompleted, setShowBlitzCompleted] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    hydrateProfileFromApi().then(() => {
      const fromProfile = loadModuleData<Record<string, unknown> | null>('language', null);
      const savedState = fromProfile || (() => {
        try {
          const raw = localStorage.getItem('ausome_user_state_v2');
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })();

      if (!savedState) return;

      if (savedState.activeLanguage) setActiveLanguage(savedState.activeLanguage);
      if (savedState.instructionLanguage) setInstructionLanguage(savedState.instructionLanguage);
      if (savedState.stars !== undefined) setStars(savedState.stars);
      if (savedState.coins !== undefined) setCoins(savedState.coins);
      if (savedState.streak !== undefined) setStreak(savedState.streak);
      if (savedState.masteredWords) setMasteredWords(savedState.masteredWords);
      if (savedState.aacUsageCount) setAacUsageCount(savedState.aacUsageCount);
      if (savedState.completedRealWorldChecklist) setCompletedRealWorldChecklist(savedState.completedRealWorldChecklist);
      if (savedState.unlockedBadgeIds) setUnlockedBadgeIds(savedState.unlockedBadgeIds);
      if (savedState.avatar) setAvatar(savedState.avatar);
      if (savedState.aacTheme) setAacTheme(savedState.aacTheme);
      if (savedState.unlockedRewardIds) setUnlockedRewardIds(savedState.unlockedRewardIds);
      if (savedState.voicePack) setVoicePack(savedState.voicePack);
      if (savedState.currentLevel !== undefined) setCurrentLevel(savedState.currentLevel);
      if (savedState.completedLevels) setCompletedLevels(savedState.completedLevels);
      if (savedState.childProfile) setChildProfile(savedState.childProfile);
      if (savedState.setupCompleted !== undefined) setSetupCompleted(savedState.setupCompleted);

      if (!fromProfile) {
        saveModuleData('language', savedState);
      }
    }).catch(() => {
      console.warn('Could not load user state from localStorage');
    });
  }, []);

  // Save state helper
  const saveStateToStorage = (updates: any) => {
    try {
      const currentState = {
        activeLanguage,
        instructionLanguage,
        stars,
        coins,
        streak,
        masteredWords,
        aacUsageCount,
        completedRealWorldChecklist,
        unlockedBadgeIds,
        avatar,
        aacTheme,
        unlockedRewardIds,
        voicePack,
        currentLevel,
        completedLevels,
        childProfile,
        setupCompleted,
        ...updates,
      };
      localStorage.setItem('ausome_user_state_v2', JSON.stringify(currentState));
      saveModuleData('language', currentState);
    } catch (e) {
      console.warn('Could not save user state');
    }
  };

  // State update wrapping helpers
  const handleSetSetupCompleted = (isDone: boolean) => {
    setSetupCompleted(isDone);
    saveStateToStorage({ setupCompleted: isDone });
  };

  const handleSetChildProfile = (profile: 'beginning' | 'emerging' | 'growing' | 'independent' | null) => {
    setChildProfile(profile);
    // Auto-map profile starter level
    let startingLvl = 1;
    if (profile === 'beginning') startingLvl = 1;
    else if (profile === 'emerging') startingLvl = 3;
    else if (profile === 'growing') startingLvl = 5;
    else if (profile === 'independent') startingLvl = 9;

    setCurrentLevel(startingLvl);
    saveStateToStorage({ childProfile: profile, currentLevel: startingLvl });
  };

  // Economy Actions
  const addStarsAndCoins = (starsEarned: number, coinsEarned: number) => {
    const updatedStars = stars + starsEarned;
    const updatedCoins = coins + coinsEarned;
    setStars(updatedStars);
    setCoins(updatedCoins);
    saveStateToStorage({ stars: updatedStars, coins: updatedCoins });
  };

  const handleWordMastered = (wordId: string) => {
    if (masteredWords.includes(wordId)) return;
    const updated = [...masteredWords, wordId];
    setMasteredWords(updated);
    saveStateToStorage({ masteredWords: updated });

    // Level 3 (Tactile Flip Book Safari) - progress tracker
    if (activeLessonId === 3) {
      const nextCount = lessonGoalCount + 1;
      setLessonGoalCount(nextCount);
      if (nextCount >= 3) {
        triggerActiveLessonCompleted();
      }
    }
  };

  const handleAACWordUsed = (wordLabel: string) => {
    const updatedCount = { ...aacUsageCount, [wordLabel]: (aacUsageCount[wordLabel] || 0) + 1 };
    setAacUsageCount(updatedCount);
    saveStateToStorage({ aacUsageCount: updatedCount });

    // Level 1 (AAC Explorer) - progress tracker
    if (activeLessonId === 1) {
      const nextCount = lessonGoalCount + 1;
      setLessonGoalCount(nextCount);
      if (nextCount >= 3) {
        triggerActiveLessonCompleted();
      }
    }
  };

  const unlockRewardItem = (itemId: string, cost: number) => {
    const updatedIds = [...unlockedRewardIds, itemId];
    const updatedCoins = coins - cost;
    setUnlockedRewardIds(updatedIds);
    setCoins(updatedCoins);
    saveStateToStorage({ unlockedRewardIds: updatedIds, coins: updatedCoins });
  };

  const unlockBadge = (badgeId: string) => {
    if (unlockedBadgeIds.includes(badgeId)) return;
    const updated = [...unlockedBadgeIds, badgeId];
    setUnlockedBadgeIds(updated);
    saveStateToStorage({ unlockedBadgeIds: updated });
  };

  const toggleChecklist = (checklistId: string) => {
    let updated: string[];
    if (completedRealWorldChecklist.includes(checklistId)) {
      updated = completedRealWorldChecklist.filter(id => id !== checklistId);
    } else {
      updated = [...completedRealWorldChecklist, checklistId];
      const points = REAL_WORLD_PRACTICE_CHECKLIST.find(ch => ch.id === checklistId)?.points || 10;
      addStarsAndCoins(points, Math.floor(points / 2));
    }
    setCompletedRealWorldChecklist(updated);
    saveStateToStorage({ completedRealWorldChecklist: updated });
  };

  // Language Swapper helper
  const handleLanguageChange = (code: LanguageCode) => {
    playSensoryChime('click');
    setActiveLanguage(code);
    saveStateToStorage({ activeLanguage: code });
    
    setTimeout(() => {
      speakText(LANGUAGE_PACKS[code].welcomeMessage, code, voicePack);
    }, 200);
  };

  const handleInstructionLanguageChange = (code: LanguageCode) => {
    playSensoryChime('click');
    setInstructionLanguage(code);
    saveStateToStorage({ instructionLanguage: code });
    
    setTimeout(() => {
      speakText(LANGUAGE_PACKS[code].welcomeMessage, code, voicePack);
    }, 200);
  };

  // LESSON CONTROLLER ACTIONS
  const launchLevelLesson = (levelId: number) => {
    playSensoryChime('click');
    setActiveLessonId(levelId);
    setLessonGoalCount(0);
    setActiveView('lesson-active');
  };

  const triggerActiveLessonCompleted = () => {
    if (!activeLessonId) return;

    playSensoryChime('success');
    
    const isAlreadyCompleted = completedLevels.includes(activeLessonId);
    const updatedCompletedList = isAlreadyCompleted 
      ? completedLevels 
      : [...completedLevels, activeLessonId];

    // Determine rewards
    const sEarn = 10;
    const cEarn = 5;

    setEarnedCoinsAnim(cEarn);
    setEarnedStarsAnim(sEarn);
    setShowPayoutOverlay(true);

    // Save level progression
    setCompletedLevels(updatedCompletedList);
    
    // Unlock next level automatically if they complete their active highest level
    let nextLevelToSet = currentLevel;
    if (activeLessonId === currentLevel && currentLevel < 10) {
      nextLevelToSet = currentLevel + 1;
      setCurrentLevel(nextLevelToSet);
    }

    // Check for Stage Completion -> Unlocks customized Certificate!
    // Level 2 (Stage 1), Level 4 (Stage 2), Level 6 (Stage 3), Level 8 (Stage 4), Level 10 (Stage 5)
    if (activeLessonId % 2 === 0) {
      const stageNo = activeLessonId / 2;
      setTimeout(() => {
        setUnlockedCertificateStage(stageNo);
      }, 1000);
    }

    saveStateToStorage({
      completedLevels: updatedCompletedList,
      currentLevel: nextLevelToSet,
    });
  };

  const closePayoutOverlay = () => {
    setShowPayoutOverlay(false);
    addStarsAndCoins(earnedStarsAnim, earnedCoinsAnim);
    setActiveView('home');
    setActiveLessonId(null);
  };

  // ASTROCADE BLITZ TIMED GAMES CONTROLS
  const launchBlitzGame = (gameType: 'match' | 'sound' | 'spell') => {
    playSensoryChime('click');
    setActiveBlitzGame(gameType);
    setBlitzScore(0);
    setBlitzTimer(30);
    setShowBlitzCompleted(false);
    setActiveView('astrocade');
  };

  useEffect(() => {
    let timerId: any;
    if (activeBlitzGame && blitzTimer > 0 && !showBlitzCompleted) {
      timerId = setInterval(() => {
        setBlitzTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            // End Blitz!
            setShowBlitzCompleted(true);
            playSensoryChime('star');
            // Pay reward based on score
            const payoutCoins = Math.max(1, Math.floor(blitzScore / 10));
            addStarsAndCoins(blitzScore, payoutCoins);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [activeBlitzGame, blitzTimer, showBlitzCompleted, blitzScore]);

  // Get active pack
  const pack = LANGUAGE_PACKS[activeLanguage];

  // Helper to compile mastered items for the dashboard
  const getMasteredItemsList = (): VocabularyItem[] => {
    const list: VocabularyItem[] = [];
    (Object.values(pack.vocabulary) as VocabularyItem[][]).forEach((arr) => {
      arr.forEach((item) => {
        if (masteredWords.includes(item.id)) {
          list.push(item);
        }
      });
    });
    return list;
  };

  // Active translation dictionary
  const t = NAV_TRANSLATIONS[instructionLanguage] || NAV_TRANSLATIONS['en'];

  // Stage details based on current Level
  const getActiveStageDetails = () => {
    if (currentLevel <= 2) return { name: t.profileBeginning, color: "text-blue-600 border-blue-200 bg-[#EBF3F5]", dot: "bg-blue-500" };
    if (currentLevel <= 4) return { name: t.profileEmerging, color: "text-emerald-700 border-emerald-200 bg-[#F0F4EE]", dot: "bg-emerald-600" };
    if (currentLevel <= 6) return { name: t.profileGrowing, color: "text-amber-800 border-amber-200 bg-[#FAF1EB]", dot: "bg-amber-600" };
    return { name: t.profileIndependent, color: "text-[#7D5A2E] border-[#EADAC2] bg-[#FAF8ED]", dot: "bg-[#7D5A2E]" };
  };

  const stageDetails = getActiveStageDetails();

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#4A4A40] font-sans flex flex-col selection:bg-teal-100 pb-28">
      
      {/* 1. UNIVERSAL TOP HEADER BAR */}
      <header className="bg-white/95 border-b border-[#D9D7C8] px-4 py-4 md:px-8 sticky top-0 z-50 shadow-sm flex items-center justify-between backdrop-blur-md">
        
        {/* Branding Logo */}
        <div 
          onClick={() => { playSensoryChime('click'); setActiveView('home'); }} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <span className="text-3xl select-none group-hover:rotate-12 transition-transform">🌿</span>
          <div>
            <h1 className="text-xl font-serif font-light tracking-tight text-[#2D2D2A] uppercase leading-none">
              AU-SOME
            </h1>
            <span className="text-[9px] font-sans font-bold text-[#5A5A40] uppercase tracking-widest block mt-1">
              Montessori Learning Portal
            </span>
          </div>
        </div>

        {/* Global economy & avatar stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          <HubLinkBar className="text-[#4A4A40] hidden sm:flex" />
          <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#4A4A40] bg-white border border-[#EAE8D9] px-3 py-1.5 rounded-2xl shadow-sm">
            <span className="text-amber-500">⭐</span>
            <span>{stars}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#4A4A40] bg-white border border-[#EAE8D9] px-3 py-1.5 rounded-2xl shadow-sm">
            <span className="text-yellow-600">🪙</span>
            <span>{coins}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#4A4A40] bg-white border border-[#EAE8D9] px-3 py-1.5 rounded-2xl shadow-sm">
            <span className="text-rose-600">🔥</span>
            <span>{streak}d</span>
          </div>

          {/* Current Level tag */}
          <div className="hidden sm:flex items-center gap-1 text-xs font-sans font-bold text-[#4A4A40] bg-white border border-[#EAE8D9] px-3 py-1.5 rounded-2xl shadow-sm">
            <span className="text-[#5A5A40]">🗺️</span>
            <span>Level {currentLevel}</span>
          </div>

          {/* Interactive Global Avatar preview button in Header */}
          <button
            id="global-avatar-header-preview"
            onClick={() => { playSensoryChime('click'); setActiveView('playhouse'); }}
            className="w-10 h-10 rounded-full bg-[#FAF5EB] border-2 border-[#EADAC2] relative flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
            title="Go to Avatar Playhouse"
          >
            {avatar.hat && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg z-10 select-none">
                {avatar.hat}
              </span>
            )}
            <span className="text-xs">😊</span>
            {avatar.outfit && (
              <span className="absolute -bottom-1 text-[10px] z-10 select-none bg-white/70 rounded-full px-1">
                {avatar.outfit}
              </span>
            )}
          </button>
        </div>

      </header>

      {/* 2. PRIMARY WINDOW AREA */}
      <main className="flex-1 p-4 md:p-8 flex flex-col justify-start">
        
        {/* Back to Home Navigator (Rendered in all sub-views except home) */}
        {activeView !== 'home' && (
          <button
            id="back-to-home-btn"
            onClick={() => { playSensoryChime('click'); setActiveView('home'); }}
            className="flex items-center gap-2 text-xs font-sans font-bold text-[#4A4A40] hover:text-[#2D2D2A] mb-6 bg-white border border-[#EAE8D9] px-5 py-2.5 rounded-full w-fit cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#5A5A40]" />
            <span>🌿 {t.backToJourney}</span>
          </button>
        )}

        {/* ONBOARDING & SETUP TRIGGERED IF childProfile NOT SELECTED */}
        {(!setupCompleted || activeView === 'setup') && (
          <div className="max-w-3xl mx-auto space-y-6 w-full animate-fade-in">
            <div className="bg-white border-2 border-[#EAE8D9] p-6 rounded-[32px] shadow-sm text-center space-y-2">
              <span className="text-4xl">🌍</span>
              <h2 className="text-2xl font-serif text-[#2D2D2A] tracking-tight font-light">
                {t.configSetup}
              </h2>
              <p className="text-xs text-stone-500 font-sans max-w-xl mx-auto leading-relaxed">
                {t.setupDesc}
              </p>
            </div>

            {/* Language Configuration Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Taught in column */}
              <div className="bg-white border-2 border-[#EAE8D9] rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-sm font-serif font-bold text-[#2D2D2A] flex items-center gap-1.5">
                  💬 {t.taughtInLabel}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, details]) => {
                    const isTaught = instructionLanguage === code;
                    return (
                      <button
                        key={`setup-taught-${code}`}
                        id={`choose-taught-${code}`}
                        onClick={() => handleInstructionLanguageChange(code as LanguageCode)}
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isTaught
                            ? 'bg-[#FAF6EC] border-[#5A5A40] text-[#5A5A40] shadow-sm font-bold'
                            : 'bg-white border-stone-100 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-sans">
                          <span className="text-2xl select-none">{details.flag}</span>
                          <span>{details.nativeName} ({details.name})</span>
                        </div>
                        {isTaught && <span className="text-[9px] bg-[#5A5A40] text-white px-2 py-0.5 rounded font-bold uppercase font-mono">OK</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Practicing column */}
              <div className="bg-white border-2 border-[#EAE8D9] rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-sm font-serif font-bold text-[#2D2D2A] flex items-center gap-1.5">
                  🎯 {t.learningLabel}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, details]) => {
                    const isLearning = activeLanguage === code;
                    return (
                      <button
                        key={`setup-learning-${code}`}
                        id={`choose-learning-${code}`}
                        onClick={() => handleLanguageChange(code as LanguageCode)}
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isLearning
                            ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-sm'
                            : 'bg-white border-stone-100 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-sans">
                          <span className="text-2xl select-none">{details.flag}</span>
                          <span>{details.nativeName} ({details.name})</span>
                        </div>
                        {isLearning && <span className="text-[9px] bg-teal-600 text-white px-2 py-0.5 rounded font-bold uppercase font-mono">LEARNING</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Starting Profile Selector */}
            <div className="bg-white border-2 border-[#EAE8D9] rounded-[32px] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-serif font-bold text-[#2D2D2A] flex items-center gap-2">
                🧒 {t.childLevel}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'beginning', title: t.profileBeginning, desc: t.profileBeginningDesc, level: 1, emoji: "🗣️" },
                  { key: 'emerging', title: t.profileEmerging, desc: t.profileEmergingDesc, level: 3, emoji: "🍎" },
                  { key: 'growing', title: t.profileGrowing, desc: t.profileGrowingDesc, level: 5, emoji: "💬" },
                  { key: 'independent', title: t.profileIndependent, desc: t.profileIndependentDesc, level: 9, emoji: "✏️" },
                ].map((prof) => {
                  const isSelected = childProfile === prof.key;
                  return (
                    <button
                      key={prof.key}
                      id={`profile-selector-${prof.key}`}
                      onClick={() => handleSetChildProfile(prof.key as any)}
                      className={`p-5 rounded-2xl border-2 text-left space-y-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FAF6EC] border-[#5A5A40] text-[#2D2D2A] ring-2 ring-[#5A5A40]/15 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl select-none">{prof.emoji}</span>
                        <span className="text-sm font-sans font-bold text-[#2D2D2A]">{prof.title}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 leading-relaxed font-sans font-normal">
                        {prof.desc}
                      </p>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#5A5A40] bg-white border px-2.5 py-0.5 rounded-full inline-block mt-1">
                        Starts Level {prof.level}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion Button */}
            <div className="flex justify-center pt-2">
              <button
                id="save-setup-config-btn"
                onClick={() => {
                  playSensoryChime('success');
                  handleSetSetupCompleted(true);
                  setActiveView('home');
                }}
                disabled={!childProfile}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-sans font-bold uppercase tracking-widest text-xs px-10 py-4.5 rounded-full cursor-pointer shadow-md transition-all hover:scale-103 active:scale-97"
              >
                {t.saveConfig}
              </button>
            </div>
          </div>
        )}

        {/* HOME SCREEN - MINIMALIST HIGH-PRECISION PORTAL HUB */}
        {setupCompleted && activeView === 'home' && (
          <div className="max-w-4xl mx-auto space-y-8 w-full animate-fade-in">
            
            {/* Top Greeting Welcome Header */}
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 bg-[#FAF8F5] border-2 border-[#EADAC2] p-6 rounded-[36px] shadow-sm relative overflow-hidden">
              <div className="space-y-1.5 text-center md:text-left relative z-10">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${stageDetails.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${stageDetails.dot} mr-1.5`} />
                  {stageDetails.name}
                </span>
                <h2 className="text-3xl font-serif font-light text-[#2D2D2A] tracking-tight leading-tight pt-1">
                  🌿 {pack.welcomeMessage}
                </h2>
                <p className="text-xs text-[#4A4A40]/80 font-sans leading-relaxed">
                  {pack.subMessage} Learn organically with tactile visual aids.
                </p>
              </div>

              {/* Main Onboarding Setup shortcut */}
              <div className="flex gap-2 shrink-0 relative z-10">
                <button
                  id="nav-setup-btn"
                  onClick={() => { playSensoryChime('click'); setActiveView('setup'); }}
                  className="p-3.5 bg-white border-2 border-[#EAE8D9] hover:border-[#5A5A40] rounded-full text-[#4A4A40] cursor-pointer shadow-sm active:scale-90 transition-all"
                  title={t.configSetup}
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRIMARY FLOW: CONTINUE LEARNING PATH (Large Call to Action) */}
            <div className="p-1">
              <div className="bg-white border-3 border-[#EAE8D9] p-8 rounded-[40px] shadow-md flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF8ED] rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#7D5A2E] bg-[#FAF8ED] border border-[#EADAC2] px-3.5 py-1 rounded-full inline-block">
                    {t.continueLearning} (Level {currentLevel})
                  </span>
                  <h3 className="text-2xl font-serif text-[#2D2D2A] tracking-tight font-bold flex items-center justify-center md:justify-start gap-2 pt-1">
                    <span className="text-3xl">{LEVELS_DB[currentLevel - 1]?.emoji || '🏆'}</span>
                    <span>{LEVELS_DB[currentLevel - 1]?.name[instructionLanguage] || LEVELS_DB[currentLevel - 1]?.name['en']}</span>
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xl leading-relaxed font-sans font-normal">
                    {LEVELS_DB[currentLevel - 1]?.description[instructionLanguage] || LEVELS_DB[currentLevel - 1]?.description['en']}
                  </p>
                </div>

                <button
                  id="continue-learning-cta-btn"
                  onClick={() => launchLevelLesson(currentLevel)}
                  className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-xs px-10 py-5 rounded-full shadow-lg transition-all hover:scale-103 active:scale-97 cursor-pointer shrink-0 flex items-center gap-2"
                >
                  <span>Play Level {currentLevel}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CURRICULUM MILESTONE JOURNEY ROAD MAP */}
            <div className="bg-white border-2 border-[#EAE8D9] rounded-[44px] p-8 space-y-6 shadow-sm">
              <div className="text-center space-y-1 pb-4">
                <h4 className="text-base font-serif font-light tracking-tight text-[#2D2D2A]">
                  🗺️ {t.milestoneMap}
                </h4>
                <p className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">
                  Unlock all 10 Levels to win the grand Master certificate!
                </p>
              </div>

              {/* Milestone road path */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 justify-items-center relative py-2">
                {LEVELS_DB.map((lvl) => {
                  const isCompleted = completedLevels.includes(lvl.id);
                  const isUnlocked = lvl.id <= currentLevel;
                  const isActive = lvl.id === currentLevel;

                  let colorStyle = 'bg-stone-100 border-stone-200 text-stone-400 opacity-60';
                  if (isActive) {
                    colorStyle = 'bg-amber-100 border-[#5A5A40] text-[#5A5A40] scale-110 ring-4 ring-amber-100/50';
                  } else if (isUnlocked) {
                    colorStyle = lvl.colorClass;
                  }

                  return (
                    <button
                      key={lvl.id}
                      id={`milestone-step-${lvl.id}`}
                      disabled={!isUnlocked}
                      onClick={() => launchLevelLesson(lvl.id)}
                      className={`relative w-28 h-28 rounded-full border-3 flex flex-col items-center justify-center cursor-pointer transition-all ${colorStyle} ${
                        isUnlocked ? 'hover:scale-103 active:scale-97' : 'cursor-not-allowed'
                      }`}
                    >
                      {/* Bouncing Pointer Arrow for active lesson */}
                      {isActive && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5A5A40] text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full animate-bounce shadow">
                          Active
                        </div>
                      )}

                      {/* Lesson Index Circle tag */}
                      <span className="absolute top-2 left-2 text-[10px] font-mono font-bold">
                        {lvl.id}
                      </span>

                      {/* Main emoji indicator */}
                      <span className="text-3xl select-none select-none">
                        {!isUnlocked ? '🔒' : lvl.emoji}
                      </span>

                      <span className="text-[9px] font-sans font-black uppercase tracking-tight text-center px-1.5 pt-1 leading-none truncate w-full">
                        {lvl.name[instructionLanguage]?.split(' ')[0] || lvl.name['en']?.split(' ')[0]}
                      </span>

                      {isCompleted && (
                        <span className="absolute -bottom-1 text-xs select-none bg-white border border-teal-200 rounded-full p-0.5 shadow-sm">
                          ✅
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ASTROCADE REINFORCEMENT BLITZ HUB (Gentle mini-game shortcuts) */}
            <div className="bg-[#FAF9F5] border-2 border-dashed border-[#D9D7C8] rounded-[40px] p-6 md:p-8 space-y-6 text-center">
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-light text-[#2D2D2A]">
                  ⚡ {t.launchAstrocade}
                </h4>
                <p className="text-xs text-[#4A4A40]/80 font-sans max-w-lg mx-auto leading-relaxed">
                  Fast timed 30-second games that reinforce learned items. Build high scores and win rapid bonus stars and coins!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  id="blitz-game-match-btn"
                  onClick={() => launchBlitzGame('match')}
                  className="bg-white border-2 border-[#EAE8D9] hover:border-blue-400 p-5 rounded-3xl text-center space-y-2 cursor-pointer transition-all hover:scale-102 active:scale-[0.98] shadow-sm flex flex-col items-center justify-center"
                >
                  <span className="text-3xl select-none">🖼️</span>
                  <span className="text-xs font-sans font-bold text-[#4A4A40]">Blitz Picture Match</span>
                  <span className="text-[9px] font-mono uppercase text-stone-400">30s Timer</span>
                </button>

                <button
                  id="blitz-game-sound-btn"
                  onClick={() => launchBlitzGame('sound')}
                  className="bg-white border-2 border-[#EAE8D9] hover:border-emerald-400 p-5 rounded-3xl text-center space-y-2 cursor-pointer transition-all hover:scale-102 active:scale-[0.98] shadow-sm flex flex-col items-center justify-center"
                >
                  <span className="text-3xl select-none">🔊</span>
                  <span className="text-xs font-sans font-bold text-[#4A4A40]">Blitz Sound Match</span>
                  <span className="text-[9px] font-mono uppercase text-stone-400">30s Timer</span>
                </button>

                <button
                  id="blitz-game-spell-btn"
                  onClick={() => launchBlitzGame('spell')}
                  className="bg-white border-2 border-[#EAE8D9] hover:border-amber-400 p-5 rounded-3xl text-center space-y-2 cursor-pointer transition-all hover:scale-102 active:scale-[0.98] shadow-sm flex flex-col items-center justify-center"
                >
                  <span className="text-3xl select-none">✏️</span>
                  <span className="text-xs font-sans font-bold text-[#4A4A40]">Blitz Spelling Match</span>
                  <span className="text-[9px] font-mono uppercase text-stone-400">30s Timer</span>
                </button>
              </div>
            </div>

            {/* SECONDARY NAVIGATION: DUAL CARDS FOR PARENT & PLAYHOUSE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
              
              <button
                id="home-secondary-parent-dashboard"
                onClick={() => { playSensoryChime('click'); setActiveView('parent-menu'); }}
                className="bg-white border-2 border-[#EAE8D9] hover:border-[#5A5A40] p-6 rounded-[36px] text-left space-y-3 cursor-pointer transition-all shadow-sm flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF4F4] flex items-center justify-center text-3xl select-none shrink-0 border border-rose-100 shadow-inner">
                  👨‍👩‍👧
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#2D2D2A]">
                    {t.parentDashboard}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                    Access child growth meters, checklists, and printable cards.
                  </p>
                </div>
              </button>

              <button
                id="home-secondary-playhouse"
                onClick={() => { playSensoryChime('click'); setActiveView('playhouse'); }}
                className="bg-white border-2 border-[#EAE8D9] hover:border-[#5A5A40] p-6 rounded-[36px] text-left space-y-3 cursor-pointer transition-all shadow-sm flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-full bg-[#FAF5EB] flex items-center justify-center text-3xl select-none shrink-0 border border-[#EADAC2] shadow-inner">
                  🧸
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#2D2D2A]">
                    {t.playhouse}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                    Spend wood coins to customize dress up clothes, hats, and rooms.
                  </p>
                </div>
              </button>

            </div>

          </div>
        )}

        {/* ACTIVE TIMED ASTROCADE BLITZ GAMES SCREEN */}
        {activeView === 'astrocade' && activeBlitzGame && (
          <div className="max-w-2xl mx-auto space-y-6 w-full animate-fade-in text-center">
            
            {/* Countdown timer indicator & Score tracker */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-[#FAF8F5] p-4 rounded-3xl border border-[#D9D7C8] shadow-inner justify-items-center">
              <div>
                <span className="text-[9px] font-sans font-bold text-[#4A4A40]/60 uppercase block">Time Remaining</span>
                <span className="text-3xl font-mono font-bold text-rose-600 animate-pulse">{blitzTimer}s</span>
              </div>
              <div>
                <span className="text-[9px] font-sans font-bold text-[#4A4A40]/60 uppercase block">Score Points</span>
                <span className="text-3xl font-mono font-bold text-teal-700">{blitzScore}</span>
              </div>
            </div>

            {/* Custom gameplay selectors */}
            {!showBlitzCompleted ? (
              <div className="pt-2">
                {activeBlitzGame === 'match' && (
                  <PictureSelectionGame
                    langCode={activeLanguage}
                    vocabulary={pack.vocabulary}
                    addStarsAndCoins={addStarsAndCoins}
                    voicePack={voicePack}
                    isBlitzMode={true}
                    onBlitzScore={(pts) => setBlitzScore(prev => prev + pts)}
                  />
                )}

                {activeBlitzGame === 'sound' && (
                  <SoundMatcherGame
                    langCode={activeLanguage}
                    addStarsAndCoins={addStarsAndCoins}
                    voicePack={voicePack}
                    onLessonComplete={() => setBlitzScore(prev => prev + 15)}
                  />
                )}

                {activeBlitzGame === 'spell' && (
                  <SpellingBuilderGame
                    langCode={activeLanguage}
                    vocabulary={pack.vocabulary}
                    addStarsAndCoins={addStarsAndCoins}
                    voicePack={voicePack}
                    onLessonComplete={() => setBlitzScore(prev => prev + 20)}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white border-2 border-[#EAE8D9] p-8 rounded-[40px] shadow-sm max-w-md mx-auto space-y-4 animate-fade-in pt-12 relative overflow-hidden">
                <span className="text-6xl animate-bounce block">🏆</span>
                <h3 className="text-2xl font-serif text-[#2D2D2A] tracking-tight font-bold">
                  Blitz Finished!
                </h3>
                <p className="text-sm font-sans text-stone-500 max-w-xs mx-auto leading-relaxed">
                  You scored <strong>{blitzScore} points</strong> against the 30-second clock! That earns you extra bonus rewards.
                </p>

                <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border flex justify-around max-w-xs mx-auto">
                  <span className="text-xs font-sans font-bold text-amber-600">⭐ +{blitzScore} Stars</span>
                  <span className="text-xs font-sans font-bold text-yellow-600">🪙 +{Math.max(1, Math.floor(blitzScore / 10))} Coins</span>
                </div>

                <div className="pt-4 flex gap-2 justify-center">
                  <button
                    onClick={() => launchBlitzGame(activeBlitzGame)}
                    className="text-xs font-sans font-bold uppercase tracking-wider px-5 py-3 rounded-full border border-stone-200 bg-white hover:bg-[#FAF9F5] cursor-pointer"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setActiveView('home')}
                    className="text-xs font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-full bg-[#5A5A40] text-white hover:bg-[#4A4A35] cursor-pointer"
                  >
                    Back to Journey
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ACTIVE CURRICULUM LESSON SCREEN CONTROLLER */}
        {activeView === 'lesson-active' && activeLessonId && (
          <div className="max-w-4xl mx-auto space-y-6 w-full animate-fade-in">
            
            {/* Active lesson instructions box */}
            <div className="bg-[#FAF8F5] border border-[#EADAC2] p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#7D5A2E]">
                  Active Lesson {activeLessonId} • {LEVELS_DB[activeLessonId - 1]?.stageName}
                </span>
                <h4 className="text-base font-serif font-bold text-[#2D2D2A] mt-0.5">
                  {LEVELS_DB[activeLessonId - 1]?.name[instructionLanguage] || LEVELS_DB[activeLessonId - 1]?.name['en']}
                </h4>
              </div>

              {/* Instant Quit Lesson back to Milestone map */}
              <button
                onClick={() => { playSensoryChime('click'); setActiveView('home'); setActiveLessonId(null); }}
                className="text-[10px] font-sans font-bold uppercase tracking-wider px-4 py-2 rounded-full border bg-white text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Quit Lesson
              </button>
            </div>

            {/* LESSON ROUTER SWITCH BOARD */}
            <div className="py-2">
              
              {/* Level 1: AAC core needs board */}
              {activeLessonId === 1 && (
                <div className="space-y-6">
                  {/* Task indicator */}
                  <div className="bg-[#E9F1F0] p-4 rounded-2xl border border-[#D1E1DF] text-center max-w-md mx-auto">
                    <p className="text-xs font-sans font-bold text-[#2D5A56]">
                      🎯 Target: Tap any 3 core needs buttons below to voice your request! ({lessonGoalCount} / 3)
                    </p>
                  </div>
                  <AACCommunication
                    aacWords={pack.aacWords}
                    langCode={activeLanguage}
                    onWordUsed={handleAACWordUsed}
                    stars={stars}
                    addStarsAndCoins={addStarsAndCoins}
                    aacTheme={aacTheme}
                    setAacTheme={setAacTheme}
                    voicePack={voicePack}
                    avatar={avatar}
                  />
                </div>
              )}

              {/* Level 2: Picture Selection Match */}
              {activeLessonId === 2 && (
                <PictureSelectionGame
                  langCode={activeLanguage}
                  vocabulary={pack.vocabulary}
                  addStarsAndCoins={addStarsAndCoins}
                  onLessonComplete={triggerActiveLessonCompleted}
                  voicePack={voicePack}
                />
              )}

              {/* Level 3: Vocabulary Flip Book Safari */}
              {activeLessonId === 3 && (
                <div className="space-y-6">
                  <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#EADAC2] text-center max-w-md mx-auto">
                    <p className="text-xs font-sans font-bold text-[#7D5A2E]">
                      🎯 Target: Explore 3 word flip cards. Listen to sounds and check phonetics! ({lessonGoalCount} / 3)
                    </p>
                  </div>
                  <VocabularyBanks
                    vocabulary={pack.vocabulary}
                    categoryLabels={pack.categoryLabels}
                    langCode={activeLanguage}
                    instructionLanguage={instructionLanguage}
                    masteredWords={masteredWords}
                    addStarsAndCoins={addStarsAndCoins}
                    onWordMastered={handleWordMastered}
                    voicePack={voicePack}
                  />
                </div>
              )}

              {/* Level 4: Animal Sound matcher */}
              {activeLessonId === 4 && (
                <SoundMatcherGame
                  langCode={activeLanguage}
                  addStarsAndCoins={addStarsAndCoins}
                  onLessonComplete={triggerActiveLessonCompleted}
                  voicePack={voicePack}
                />
              )}

              {/* Level 5: Sentence block building */}
              {activeLessonId === 5 && (
                <div className="space-y-6">
                  <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#EADAC2] text-center max-w-md mx-auto">
                    <p className="text-xs font-sans font-bold text-[#7D5A2E]">
                      🎯 Target: Compose 3 spoken phrases by stacking cards, then click Speak Phrase! ({lessonGoalCount} / 3)
                    </p>
                    {/* Fake callback tracker wrapper */}
                    <button
                      onClick={() => {
                        const nextCount = lessonGoalCount + 1;
                        setLessonGoalCount(nextCount);
                        playSensoryChime('success');
                        addStarsAndCoins(2, 1);
                        if (nextCount >= 3) {
                          triggerActiveLessonCompleted();
                        }
                      }}
                      className="text-[9px] font-sans font-bold uppercase text-[#7D5A2E] bg-white border border-[#EADAC2] px-2.5 py-1 rounded-full mt-2 inline-block cursor-pointer"
                    >
                      Record 1 Built Phrase
                    </button>
                  </div>
                  <SentenceBuilder
                    sentenceBlocks={pack.sentenceBlocks}
                    langCode={activeLanguage}
                    addStarsAndCoins={addStarsAndCoins}
                    voicePack={voicePack}
                  />
                </div>
              )}

              {/* Level 6: Picture story gap fill-in */}
              {activeLessonId === 6 && (
                <MissingWordGame
                  langCode={activeLanguage}
                  addStarsAndCoins={addStarsAndCoins}
                  onLessonComplete={triggerActiveLessonCompleted}
                  voicePack={voicePack}
                />
              )}

              {/* Level 7: Restaurant social story ordering */}
              {activeLessonId === 7 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center max-w-md mx-auto">
                    <p className="text-xs font-sans text-emerald-800 font-bold">
                      🍕 Complete Pip's restaurant scenario below step-by-step to earn badges & stars!
                    </p>
                  </div>
                  <SocialCommunication
                    langCode={activeLanguage}
                    addStarsAndCoins={addStarsAndCoins}
                    unlockedBadgeIds={unlockedBadgeIds}
                    unlockBadge={(badge) => {
                      unlockBadge(badge);
                      triggerActiveLessonCompleted();
                    }}
                    voicePack={voicePack}
                  />
                </div>
              )}

              {/* Level 8: Playground turn-taking social story */}
              {activeLessonId === 8 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center max-w-md mx-auto">
                    <p className="text-xs font-sans text-emerald-800 font-bold">
                      🪁 Complete Sammy's turn-taking playground story below to master social skills!
                    </p>
                  </div>
                  <SocialCommunication
                    langCode={activeLanguage}
                    addStarsAndCoins={addStarsAndCoins}
                    unlockedBadgeIds={unlockedBadgeIds}
                    unlockBadge={(badge) => {
                      unlockBadge(badge);
                      triggerActiveLessonCompleted();
                    }}
                    voicePack={voicePack}
                  />
                </div>
              )}

              {/* Level 9: Spelling letters constructor */}
              {activeLessonId === 9 && (
                <SpellingBuilderGame
                  langCode={activeLanguage}
                  vocabulary={pack.vocabulary}
                  addStarsAndCoins={addStarsAndCoins}
                  onLessonComplete={triggerActiveLessonCompleted}
                  voicePack={voicePack}
                />
              )}

              {/* Level 10: Listening directions */}
              {activeLessonId === 10 && (
                <div className="space-y-6">
                  <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#EADAC2] text-center max-w-md mx-auto">
                    <p className="text-xs font-sans font-bold text-[#7D5A2E]">
                      🎯 Target: Follow 3 audio commands of increasing difficulty! ({lessonGoalCount} / 3)
                    </p>
                    <button
                      onClick={() => {
                        const nextCount = lessonGoalCount + 1;
                        setLessonGoalCount(nextCount);
                        playSensoryChime('success');
                        addStarsAndCoins(3, 1);
                        if (nextCount >= 3) {
                          triggerActiveLessonCompleted();
                        }
                      }}
                      className="text-[9px] font-sans font-bold uppercase text-[#7D5A2E] bg-white border border-[#EADAC2] px-2.5 py-1 rounded-full mt-2 inline-block cursor-pointer"
                    >
                      Record 1 Auditory Instruction Completed
                    </button>
                  </div>
                  <ListeningDirections
                    langCode={activeLanguage}
                    vocabulary={pack.vocabulary}
                    addStarsAndCoins={addStarsAndCoins}
                    voicePack={voicePack}
                  />
                </div>
              )}

            </div>

          </div>
        )}

        {/* PARENT MENU VIEW - QUALITATIVE GRAPHS, PRINTOUTS & CHECKLIST */}
        {activeView === 'parent-menu' && (
          <ParentDashboard
            langCode={activeLanguage}
            masteredWordsList={getMasteredItemsList()}
            aacUsageCount={aacUsageCount}
            stars={stars}
            coins={coins}
            streak={streak}
            completedRealWorldChecklist={completedRealWorldChecklist}
            toggleChecklist={toggleChecklist}
            unlockedBadgeIds={unlockedBadgeIds}
          />
        )}

        {/* AVATAR PLAYHOUSE SHOP VIEW */}
        {activeView === 'playhouse' && (
          <LearnAndEarn
            stars={stars}
            coins={coins}
            streak={streak}
            unlockedRewardIds={unlockedRewardIds}
            unlockRewardItem={unlockRewardItem}
            avatar={avatar}
            setAvatar={setAvatar}
            setAacTheme={setAacTheme}
          />
        )}

        {/* MONTESSORI SANDPAPER AND LETTER WOOD BOXES SHOP */}
        {activeView === 'materials' && (
          <MontessoriShop />
        )}

      </main>

      {/* 3. INTERACTIVE STICKY BOTTOM TASKBAR (Dashboard, Playhouse, Materials, Hub) */}
      {setupCompleted && (
        <nav id="bottom-taskbar-navigation" className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 border-2 border-[#D9D7C8] px-6 py-3.5 rounded-full flex items-center justify-around gap-6 md:gap-12 backdrop-blur-md shadow-lg z-40 max-w-[92%] sm:max-w-md w-full transition-all">
          
          {/* Taskbar Link: Portal Hub */}
          <button
            id="taskbar-link-home"
            onClick={() => { playSensoryChime('click'); setActiveView('home'); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeView === 'home' || activeView === 'lesson-active'
                ? 'text-[#5A5A40] scale-105 font-bold'
                : 'text-[#4A4A40]/60 hover:text-[#2D2D2A]'
            }`}
          >
            <span className="text-xl select-none">🌿</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest leading-none">{t.taskbarHome}</span>
          </button>

          {/* Taskbar Link: Playhouse */}
          <button
            id="taskbar-link-playhouse"
            onClick={() => { playSensoryChime('click'); setActiveView('playhouse'); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeView === 'playhouse'
                ? 'text-[#5A5A40] scale-105 font-bold'
                : 'text-[#4A4A40]/60 hover:text-[#2D2D2A]'
            }`}
          >
            <span className="text-xl select-none">🧸</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest leading-none">{t.taskbarPlayhouse}</span>
          </button>

          {/* Taskbar Link: Materials */}
          <button
            id="taskbar-link-materials"
            onClick={() => { playSensoryChime('click'); setActiveView('materials'); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeView === 'materials'
                ? 'text-[#5A5A40] scale-105 font-bold'
                : 'text-[#4A4A40]/60 hover:text-[#2D2D2A]'
            }`}
          >
            <span className="text-xl select-none">🛒</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest leading-none">{t.taskbarMaterials}</span>
          </button>

          {/* Taskbar Link: Parent Insights */}
          <button
            id="taskbar-link-dashboard"
            onClick={() => { playSensoryChime('click'); setActiveView('parent-menu'); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeView === 'parent-menu'
                ? 'text-[#5A5A40] scale-105 font-bold'
                : 'text-[#4A4A40]/60 hover:text-[#2D2D2A]'
            }`}
          >
            <span className="text-xl select-none">📊</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest leading-none">{t.taskbarDashboard}</span>
          </button>
        </nav>
      )}

      {/* 4. COIN & STAR LESSON COMPLETION REWARDS MODAL (MICRO-ANIMATION PAYOFF) */}
      {showPayoutOverlay && (
        <div className="fixed inset-0 bg-[#4A4A40]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#EAE8D9] rounded-[44px] p-8 max-w-sm w-full text-center space-y-5 animate-scale-up relative overflow-hidden shadow-2xl">
            
            {/* Sparkle decorative icons */}
            <div className="absolute top-4 left-4 text-3xl select-none animate-pulse">✨</div>
            <div className="absolute top-4 right-4 text-3xl select-none animate-pulse">✨</div>

            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#FAF8ED] border-2 border-[#EADAC2] flex items-center justify-center relative shadow-inner">
                {/* Floating animated coin */}
                <span className="text-5xl select-none animate-bounce">🪙</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-serif text-[#2D2D2A] font-bold">
                {t.lessonComplete}
              </h3>
              <p className="text-xs text-stone-500 font-sans max-w-xs mx-auto">
                Incredible work! Today's milestones have been recorded meticulously. Check your new stars & coins:
              </p>
            </div>

            {/* Reward readout card */}
            <div className="bg-[#FAF9F5] p-4 rounded-3xl border border-[#EAE8D9] grid grid-cols-2 gap-4 max-w-xs mx-auto">
              <div className="space-y-0.5 text-center">
                <span className="text-xs text-stone-400 font-sans block">Stars Earned</span>
                <span className="text-xl font-mono font-black text-amber-600">⭐ +{earnedStarsAnim}</span>
              </div>
              <div className="space-y-0.5 text-center">
                <span className="text-xs text-stone-400 font-sans block">Coins Earned</span>
                <span className="text-xl font-mono font-black text-yellow-600">🪙 +{earnedCoinsAnim}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="claim-reward-close-btn"
                onClick={closePayoutOverlay}
                className="w-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-xs py-4 rounded-full shadow-md cursor-pointer hover:scale-103 active:scale-97 transition-all"
              >
                {t.nextLevel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MONTESSORI STAGE COMPLETION CERTIFICATE MODAL PREVIEW */}
      {unlockedCertificateStage !== null && (
        <div className="fixed inset-0 bg-[#4A4A40]/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6EC] border-8 border-double border-[#D9C4A2] rounded-[48px] p-6 md:p-10 max-w-2xl w-full text-center space-y-6 relative overflow-hidden shadow-2xl animate-fade-in printable-certificate">
            
            {/* Corner Decorative Borders */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-4 border-l-4 border-[#D9C4A2]" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-4 border-r-4 border-[#D9C4A2]" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-4 border-l-4 border-[#D9C4A2]" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-4 border-r-4 border-[#D9C4A2]" />

            <div className="space-y-2">
              <span className="text-5xl select-none animate-bounce block">🎓</span>
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-[#7D5A2E]">
                {t.certificateUnlocked}
              </h3>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2D2D2A] tracking-tight">
                Montessori Language Award
              </h2>
            </div>

            {/* Certificate Core details */}
            <div className="py-2 space-y-4">
              <p className="text-xs font-serif italic text-[#4A4A40]">
                This digital credential certifies that
              </p>

              {/* Name customizer input */}
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Enter Child's Name"
                  value={certificateChildName}
                  onChange={(e) => setCertificateChildName(e.target.value)}
                  className="w-full bg-white border-b-2 border-dashed border-[#7D5A2E] py-2 text-center font-serif text-lg text-[#2D2D2A] font-bold outline-none focus:border-solid placeholder:font-serif placeholder:font-normal placeholder:opacity-50"
                />
                <span className="text-[9px] font-sans text-stone-400 block mt-1 uppercase">
                  {t.personalizeCertificate}
                </span>
              </div>

              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-sans">
                has successfully completed <strong className="text-[#2D2D2A]">Stage {unlockedCertificateStage}</strong> of the <strong>AU-SOME Montessori Curriculum</strong>, demonstrating incredible growth in expressive speaking and visual focus!
              </p>
            </div>

            {/* Medal Seals signature block */}
            <div className="flex justify-between items-center px-4 max-w-md mx-auto pt-4 border-t border-[#EADAC2]">
              <div className="text-left">
                <span className="font-serif text-xs font-bold text-[#4A4A40] block">Pip & Sammy</span>
                <span className="text-[9px] font-sans text-stone-400 block uppercase">Learning Guides</span>
              </div>

              {/* Medal ribbon icon */}
              <div className="w-16 h-16 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center relative shadow">
                <Award className="w-8 h-8 text-yellow-600" />
                <div className="absolute -bottom-2 w-4 h-6 bg-red-500 rounded-b opacity-80 left-4" />
                <div className="absolute -bottom-2 w-4 h-6 bg-red-500 rounded-b opacity-80 right-4" />
              </div>

              <div className="text-right">
                <span className="font-serif text-xs font-bold text-[#4A4A40] block">
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </span>
                <span className="text-[9px] font-sans text-stone-400 block uppercase">Credential Date</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => {
                  playSensoryChime('click');
                  window.print();
                }}
                className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider px-5 py-3 rounded-full border border-stone-300 bg-white hover:bg-[#FAF9F5] text-stone-700 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                <span>Print PDF</span>
              </button>
              
              <button
                onClick={() => {
                  playSensoryChime('success');
                  setUnlockedCertificateStage(null);
                  setCertificateChildName('');
                }}
                className="text-xs font-sans font-bold uppercase tracking-widest px-6 py-3 rounded-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white cursor-pointer shadow"
              >
                {t.claimReward}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Universal subtle styling footer info */}
      <footer className="mx-4 md:mx-8 mt-12 flex flex-col md:flex-row justify-between border-t border-[#D9D7C8] pt-6 pb-20 text-[#4A4A40]/60 text-xs font-sans gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#5A5A40]">●</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Montessori Language Journey</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#5A5A40]">●</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Autism-First Design</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#5A5A40]">●</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Self-Paced Exploration</span>
          </div>
        </div>
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} AU-SOME. Inspired by Maria Montessori.
        </p>
      </footer>

    </div>
  );
}
