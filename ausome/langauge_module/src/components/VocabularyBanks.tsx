import React, { useState, useEffect } from 'react';
import { VocabCategory, VocabularyItem, LanguageCode } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { LANGUAGE_PACKS } from '../languages/data';
import { BookOpen, HelpCircle, Volume2, CheckCircle, ArrowLeft, Star, Heart, Sparkles } from 'lucide-react';

interface VocabularyBanksProps {
  vocabulary: Record<VocabCategory, VocabularyItem[]>;
  categoryLabels: Record<VocabCategory, string>;
  langCode: LanguageCode;
  instructionLanguage?: LanguageCode;
  masteredWords: string[];
  addStarsAndCoins: (stars: number, coins: number) => void;
  onWordMastered: (wordId: string) => void;
  voicePack: string;
}

const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    backCategory: "Back to category",
    backCategories: "Back to categories",
    vocabBanks: "Vocabulary Banks",
    selectCategory: "Select a category to build your vocabulary. Earn Stars & Coins for learning words!",
    progress: "Progress",
    allMastered: "All Mastered",
    selectWord: "Select a word to listen, practice, and master.",
    mastered: "Mastered & Saved!",
    markMastered: "Mark as Mastered",
    lessonStep: "Lesson Step",
    avatarDemo: "Avatar Demonstration Mode",
    avatarDemoDesc: "The app avatar has fully vocalized the word and spoken the complete practice sentence. Watch and listen.",
    practiceSentence: "Practice Sentence",
    quickReminder: "Quick Reminder:",
    reminderDesc: "No long demo this round. Let's practice saying the word!",
    hearWord: "Hear Word",
    hearSentence: "Hear Sentence",
    noWaiting: "No Waiting Mode:",
    noWaitingDesc: "You've learned this word before! We bypassed all introductions to keep you in total control. Use the buttons below if you want help.",
    repeatWord: "Repeat word",
    speakSentence: "Speak sentence",
    montessoriHome: "Montessori Home Connection",
    montessoriHomeDesc: "To fully cement learning, try to connect this word with real objects. If possible, show a physical item, let them trace the outline with their fingers, and vocalize together.",
    phonetics: "Phonetics",
    englishCross: "English cross-reference",
    tapped: "Tapped",
    mouthLipSync: "Mouth Lip-Sync Guide",
    articulationSpeed: "Articulation Speed",
    slow: "Slow",
    natural: "Natural",
    fast: "Fast"
  },
  es: {
    backCategory: "Volver a la categoría",
    backCategories: "Volver a las categorías",
    vocabBanks: "Bancos de Vocabulario",
    selectCategory: "Selecciona una categoría para desarrollar tu vocabulario. ¡Gana estrellas y monedas!",
    progress: "Progreso",
    allMastered: "Todo Dominado",
    selectWord: "Selecciona una palabra para escuchar, practicar y dominar.",
    mastered: "¡Dominado y Guardado!",
    markMastered: "Marcar como Dominado",
    lessonStep: "Paso de la Lección",
    avatarDemo: "Modo Demostración del Avatar",
    avatarDemoDesc: "El avatar de la aplicación ha vocalizado completamente la palabra y pronunciado la oración. Mira y escucha.",
    practiceSentence: "Oración de Práctica",
    quickReminder: "Recordatorio Rápido:",
    reminderDesc: "Sin demostración larga esta ronda. ¡Practiquemos decir la palabra!",
    hearWord: "Escuchar Palabra",
    hearSentence: "Escuchar Oración",
    noWaiting: "Modo Sin Esperas:",
    noWaitingDesc: "¡Ya has aprendido esta palabra antes! Omitimos todas las introducciones para mantenerte en control total.",
    repeatWord: "Repetir palabra",
    speakSentence: "Decir oración",
    montessoriHome: "Conexión Hogareña Montessori",
    montessoriHomeDesc: "Para consolidar el aprendizaje, intenta conectar esta palabra con objetos reales en tu casa. Muestra un elemento físico y vocalicen juntos.",
    phonetics: "Fonética",
    englishCross: "Referencia en Inglés",
    tapped: "Tocado",
    mouthLipSync: "Guía de Sincronización Labial",
    articulationSpeed: "Velocidad de Articulación",
    slow: "Lento",
    natural: "Natural",
    fast: "Rápido"
  },
  de: {
    backCategory: "Zurück zur Kategorie",
    backCategories: "Zurück zu den Kategorien",
    vocabBanks: "Wortschatz-Datenbanken",
    selectCategory: "Wählen Sie eine Kategorie, um Ihren Wortschatz aufzubauen. Verdienen Sie Sterne & Münzen!",
    progress: "Fortschritt",
    allMastered: "Alles Gelernt",
    selectWord: "Wählen Sie ein Wort aus, um es anzuhören, zu üben und zu lernen.",
    mastered: "Gelernt & Gespeichert!",
    markMastered: "Als gelernt markieren",
    lessonStep: "Lektionsschritt",
    avatarDemo: "Avatar-Demonstrationsmodus",
    avatarDemoDesc: "Der App-Avatar hat das Wort vollständig ausgesprochen und den Übungssatz vorgelesen. Schauen und zuhören.",
    practiceSentence: "Übungssatz",
    quickReminder: "Kurze Erinnerung:",
    reminderDesc: "Keine lange Demo in dieser Runde. Lass uns üben, das Wort auszusprechen!",
    hearWord: "Wort Hören",
    hearSentence: "Satz Hören",
    noWaiting: "Keine Wartezeit-Modus:",
    noWaitingDesc: "Sie haben dieses Wort schon einmal gelernt! Wir haben alle Einführungen übersprungen, um Ihnen die Kontrolle zu überlassen.",
    repeatWord: "Wort wiederholen",
    speakSentence: "Satz sprechen",
    montessoriHome: "Montessori-Verbindung für Zuhause",
    montessoriHomeDesc: "Um das Lernen zu festigen, versuchen Sie, dieses Wort mit realen Objekten zu verbinden. Zeigen Sie einen Gegenstand und sprechen Sie die Töne gemeinsam.",
    phonetics: "Phonetik",
    englishCross: "Englische Referenz",
    tapped: "Getippt",
    mouthLipSync: "Lippensynchronisations-Anleitung",
    articulationSpeed: "Aussprachegeschwindigkeit",
    slow: "Langsam",
    natural: "Natürlich",
    fast: "Schnell"
  },
  zh: {
    backCategory: "返回类别",
    backCategories: "返回所有类别",
    vocabBanks: "词汇库",
    selectCategory: "选择一个类别来积累你的词汇。学习单词可以赚取星星和硬币！",
    progress: "进度",
    allMastered: "全部掌握",
    selectWord: "选择一个单词来听、练习并掌握它。",
    mastered: "已掌握并保存！",
    markMastered: "标记为已掌握",
    lessonStep: "学习步骤",
    avatarDemo: "小助手示范模式",
    avatarDemoDesc: "小助手已经完整读出该单词并念出了练习句子。请仔细观看和聆听。",
    practiceSentence: "练习句子",
    quickReminder: "温馨提示：",
    reminderDesc: "本轮没有长示范。让我们直接练习说这个单词！",
    hearWord: "听单词",
    hearSentence: "听句子",
    noWaiting: "无等待模式：",
    noWaitingDesc: "你以前学过这个单词！我们跳过了所有介绍，让你完全掌控进度。",
    repeatWord: "重复单词",
    speakSentence: "朗读句子",
    montessoriHome: "蒙特梭利家庭互动",
    montessoriHomeDesc: "为了巩固学习，请尝试将此单词与现实中的物品联系起来。展示实物，一起摸一摸并发出声音。",
    phonetics: "发音指南",
    englishCross: "英文对照",
    tapped: "点击了",
    mouthLipSync: "嘴型发音指南",
    articulationSpeed: "发音速度",
    slow: "慢速",
    natural: "常速",
    fast: "快速"
  },
  ar: {
    backCategory: "العودة إلى الفئة",
    backCategories: "العودة إلى الفئات",
    vocabBanks: "بنوك الكلمات",
    selectCategory: "اختر فئة لبناء مفرداتك. اكسب النجوم والعملات المعدنية لتعلم الكلمات!",
    progress: "التقدم",
    allMastered: "تم إتقان الكل",
    selectWord: "اختر كلمة للاستماع والممارسة والإتقان.",
    mastered: "تم الإتقان والحفظ!",
    markMastered: "تحديد كمتقن",
    lessonStep: "خطوة الدرس",
    avatarDemo: "وضع عرض المجسم",
    avatarDemoDesc: "قام مجسم التطبيق بنطق الكلمة كاملة وقراءة جملة الممارسة. شاهد واستمع.",
    practiceSentence: "جملة الممارسة",
    quickReminder: "تذكير سريع:",
    reminderDesc: "لا يوجد عرض طويل في هذه الجولة. لنمارس نطق الكلمة!",
    hearWord: "سماع الكلمة",
    hearSentence: "سماع الجملة",
    noWaiting: "وضع دون انتظار:",
    noWaitingDesc: "لقد تعلمت هذه الكلمة من قبل! لقد تخطينا المقدمات لنمنحك التحكم الكامل.",
    repeatWord: "تكرار الكلمة",
    speakSentence: "نطق الجملة",
    montessoriHome: "رابط مونتيسوري المنزلي",
    montessoriHomeDesc: "لتثبيت التعلم بالكامل، حاول ربط هذه الكلمة بأشياء حقيقية في منزلك. اعرض مجسماً وتدربا على النطق معاً.",
    phonetics: "الصوتيات",
    englishCross: "مرجع إنجليزي",
    tapped: "تم النقر",
    mouthLipSync: "دليل حركة الشفاه",
    articulationSpeed: "سرعة النطق",
    slow: "بطيء",
    natural: "طبيعي",
    fast: "سريع"
  }
};

export default function VocabularyBanks({
  vocabulary,
  categoryLabels,
  langCode,
  instructionLanguage = 'en',
  masteredWords,
  addStarsAndCoins,
  onWordMastered,
  voicePack,
}: VocabularyBanksProps) {
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | null>(null);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  
  // Local articulation speed override
  const [speed, setSpeed] = useState<'slower' | 'natural' | 'fast'>('natural');

  // Viseme state
  const [activeViseme, setActiveViseme] = useState<string>('neutral');

  const t = UI_TRANSLATIONS[instructionLanguage] || UI_TRANSLATIONS['en'];

  // Track attempts per word
  const [wordAttempts, setWordAttempts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('ausome_word_attempts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveAttempts = (updated: Record<string, number>) => {
    setWordAttempts(updated);
    try {
      localStorage.setItem('ausome_word_attempts', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save word attempts to localStorage');
    }
  };

  // Viseme Sequencer
  const playVisemeSequence = (visemes?: string[]) => {
    const list = visemes && visemes.length > 0 ? visemes : ['neutral', 'open', 'wide', 'closed', 'neutral'];
    let idx = 0;
    setActiveViseme(list[0]);
    
    // speed multiplier
    const speedMs = speed === 'slower' ? 450 : speed === 'fast' ? 220 : 320;

    const interval = setInterval(() => {
      idx++;
      if (idx < list.length) {
        setActiveViseme(list[idx]);
      } else {
        clearInterval(interval);
        setActiveViseme('neutral');
      }
    }, speedMs);
  };

  const handleCategorySelect = (category: VocabCategory) => {
    playSensoryChime('click');
    setSelectedCategory(category);
    setSelectedWord(null);
  };

  const handleWordSelect = (word: VocabularyItem) => {
    playSensoryChime('click');
    setSelectedWord(word);

    const currentAttempts = wordAttempts[word.id] || 0;
    const nextAttempts = currentAttempts + 1;
    const updatedAttempts = { ...wordAttempts, [word.id]: nextAttempts };
    saveAttempts(updatedAttempts);

    // Dynamic demonstration based on attempt
    if (nextAttempts === 1) {
      speakText(`${word.word}. ${word.example}`, langCode, speed);
      playVisemeSequence(word.viseme);
    } else if (nextAttempts === 2) {
      speakText(word.word, langCode, speed);
      playVisemeSequence(word.viseme);
    }
  };

  const triggerRepeatVoice = (word: VocabularyItem) => {
    playSensoryChime('click');
    speakText(word.word, langCode, speed);
    playVisemeSequence(word.viseme);
  };

  const triggerRepeatExample = (word: VocabularyItem) => {
    playSensoryChime('click');
    speakText(word.example, langCode, speed);
  };

  const handleMarkMastered = (word: VocabularyItem) => {
    if (masteredWords.includes(word.id)) return;
    playSensoryChime('success');
    addStarsAndCoins(5, 2);
    onWordMastered(word.id);
  };

  // Icon mapping for categories
  const categoryEmojis: Record<VocabCategory, string> = {
    animals: '🐶',
    food: '🍎',
    feelings: '😊',
    home: '🏠',
    school: '🏫',
    community: '🚒',
    nature: '🌿',
    actions: '🏃',
  };

  // Color theme mapping for categories
  const categoryColors: Record<VocabCategory, string> = {
    animals: 'bg-[#F5E6E0] border-[#E8D1C8] hover:bg-[#EED8CE] text-[#7D5546]',
    food: 'bg-[#E9F1F0] border-[#D1E1DF] hover:bg-[#DEEBEA] text-[#2D5A56]',
    feelings: 'bg-[#EAEAF5] border-[#D5D5E8] hover:bg-[#DEE0EB] text-[#4F4F7A]',
    home: 'bg-[#F9F1DC] border-[#ECE0C2] hover:bg-[#F2E7C4] text-[#6B5A30]',
    school: 'bg-[#F3F8FC] border-[#D3E5F3] hover:bg-[#E3EFF9] text-[#1D5E92]',
    community: 'bg-[#FFF4F4] border-[#FFDADA] hover:bg-[#FFEAEB] text-[#A63D3D]',
    nature: 'bg-[#F0F5E8] border-[#DDE6D1] hover:bg-[#E4ECCF] text-[#4D5A3D]',
    actions: 'bg-[#FAF2F9] border-[#ECDCEE] hover:bg-[#F3E2F4] text-[#7A2E80]',
  };

  return (
    <div id="vocabulary-banks-container" className="max-w-4xl mx-auto space-y-6 w-full">
      
      {/* Back navigation button */}
      {(selectedCategory || selectedWord) && (
        <button
          id="vocab-back-btn"
          onClick={() => {
            playSensoryChime('click');
            if (selectedWord) {
              setSelectedWord(null);
            } else {
              setSelectedCategory(null);
            }
          }}
          className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#4A4A40] hover:text-[#2D2D2A] px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] transition-all w-fit border-2 border-[#EAE8D9] cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#5A5A40]" />
          <span>{selectedWord ? t.backCategory : t.backCategories}</span>
        </button>
      )}

      {/* 1. Vocabulary Home Screen: Display Categories */}
      {!selectedCategory && (
        <div className="space-y-6">
          <div className="p-6 rounded-[32px] bg-white border-2 border-[#EAE8D9] shadow-sm">
            <h2 className="text-2xl font-serif font-light text-[#2D2D2A] flex items-center gap-2">
              📚 {t.vocabBanks}
            </h2>
            <p className="text-xs text-[#4A4A40]/80 mt-1 font-sans">
              {t.selectCategory}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(vocabulary) as VocabCategory[]).map((cat) => {
              const masteredCountInCat = (vocabulary[cat] || []).filter(w => masteredWords.includes(w.id)).length;
              const totalCountInCat = (vocabulary[cat] || []).length;
              const isAllMastered = totalCountInCat > 0 && masteredCountInCat === totalCountInCat;

              return (
                <button
                  key={cat}
                  id={`vocab-category-${cat}`}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex flex-col items-center justify-between p-6 rounded-[44px] border-3 transition-all cursor-pointer text-center min-h-[190px] hover:scale-103 active:scale-97 shadow-md ${categoryColors[cat]}`}
                >
                  <span className="text-5xl mb-3 select-none">
                    {categoryEmojis[cat]}
                  </span>
                  
                  <div className="space-y-2 flex flex-col items-center">
                    <span className="inline-block text-xs font-black tracking-tight leading-none bg-white/80 px-4 py-2.5 rounded-full border border-black/5 text-[#2D2D2A] shadow-sm">
                      {LANGUAGE_PACKS[instructionLanguage]?.categoryLabels[cat] || categoryLabels[cat]}
                    </span>
                    <span className="inline-block text-[9px] font-sans font-black uppercase tracking-wider opacity-85 bg-black/5 px-2.5 py-1 rounded-full">
                      {masteredCountInCat} / {totalCountInCat} {t.progress}
                    </span>
                  </div>

                  {isAllMastered && (
                    <span className="mt-3 text-[9px] font-sans font-black uppercase tracking-wider bg-white px-3.5 py-1.5 rounded-full border-2 border-teal-200 text-teal-800 flex items-center gap-1 shadow-sm">
                      👑 {t.allMastered}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Category Word List screen */}
      {selectedCategory && !selectedWord && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-[32px] bg-white border-2 border-[#EAE8D9] shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">{categoryEmojis[selectedCategory]}</span>
              <div>
                <h3 className="text-xl font-serif text-[#2D2D2A] tracking-tight">
                  {LANGUAGE_PACKS[instructionLanguage]?.categoryLabels[selectedCategory] || categoryLabels[selectedCategory]}
                </h3>
                <p className="text-xs text-[#4A4A40]/80 font-sans">
                  {t.selectWord}
                </p>
              </div>
            </div>
            
            <span className="text-xs font-sans font-bold uppercase tracking-wider bg-[#F9F8F3] border-2 border-[#EAE8D9] px-4 py-1.5 rounded-full text-[#4A4A40] shadow-inner">
              ⭐ {t.progress}: {(vocabulary[selectedCategory] || []).filter(w => masteredWords.includes(w.id)).length} / {(vocabulary[selectedCategory] || []).length}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(vocabulary[selectedCategory] || []).map((word) => {
              const isMastered = masteredWords.includes(word.id);
              const attempts = wordAttempts[word.id] || 0;

              return (
                <button
                  key={word.id}
                  id={`vocab-word-${word.id}`}
                  onClick={() => handleWordSelect(word)}
                  className={`flex items-center gap-4 p-4.5 rounded-[28px] border-3 text-left cursor-pointer transition-all hover:border-[#5A5A40] active:scale-[0.97] shadow-sm ${
                    isMastered
                      ? 'bg-teal-50/70 border-teal-300 text-teal-900 shadow-sm'
                      : 'bg-white border-[#EAE8D9]'
                  }`}
                >
                  <span className="text-4xl select-none">{word.emoji}</span>
                  <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
                    <span className="inline-block font-sans font-black text-xs text-[#2D2D2A] bg-[#FAF8F5] border-2 border-[#EADAC2] px-3.5 py-1.5 rounded-full shadow-inner truncate">
                      {word.word}
                    </span>
                    <span className="block text-[10px] text-[#4A4A40]/60 italic font-mono pl-1">
                      {word.phonetic}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {isMastered ? (
                      <CheckCircle className="w-6 h-6 text-teal-600 shrink-0" />
                    ) : attempts > 0 ? (
                      <span className="text-[9px] font-sans font-black uppercase tracking-wider bg-amber-50 border-2 border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
                        {t.tapped} {attempts}x
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#EAE8D9] border-2 border-stone-200" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Detailed Word Card */}
      {selectedCategory && selectedWord && (
        <div className="bg-white border-2 border-[#EAE8D9] rounded-[40px] p-6 md:p-8 space-y-6 shadow-sm animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EAE8D9]">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-[#FAF6EC] border-2 border-[#EADAC2] shadow-inner flex items-center justify-center text-5xl select-none relative group">
                {selectedWord.emoji}
                {/* Embedded dynamic stars sparkle effect */}
                {masteredWords.includes(selectedWord.id) && (
                  <span className="absolute -top-1 -right-1 text-base animate-bounce">👑</span>
                )}
              </div>
              <div>
                <h3 className="text-3xl font-serif font-light text-[#2D2D2A] tracking-tight flex items-center gap-2">
                  <span className="font-bold">{selectedWord.word}</span>
                  <button
                    id="speak-word-btn"
                    onClick={() => triggerRepeatVoice(selectedWord)}
                    className="p-2 rounded-full bg-[#FAF6EC] hover:bg-[#FAF9F3] border-2 border-[#EADAC2] text-[#5A5A40] transition-all cursor-pointer shadow-sm active:scale-90"
                    title={t.hearWord}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-[#4A4A40]/70 mt-1">
                  🗣️ {t.phonetics}: {selectedWord.phonetic}
                </p>
                {langCode !== 'en' && (
                  <p className="text-xs text-[#4A4A40]/60 mt-1 font-sans">
                    {t.englishCross}: <span className="font-semibold text-[#5A5A40]">{selectedWord.englishWord}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              {masteredWords.includes(selectedWord.id) ? (
                <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 px-5 py-2.5 rounded-full text-teal-800 font-bold text-xs uppercase tracking-wider font-sans shadow-sm">
                  <CheckCircle className="w-5 h-5 text-teal-600 animate-pulse" />
                  <span>{t.mastered}</span>
                </div>
              ) : (
                <button
                  id="mark-mastered-btn"
                  onClick={() => handleMarkMastered(selectedWord)}
                  className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-full cursor-pointer shadow-md transition-all hover:scale-102 active:scale-98"
                >
                  <Star className="w-4 h-4 fill-amber-300 stroke-amber-400 animate-pulse" />
                  <span>{t.markMastered} (+5 ⭐)</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Multi-Sensory Aids (Lip-Sync and Speed controls) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Visual Lip-Sync Mouth shape animator */}
            <div className="p-5 bg-[#FAF9F5] border border-[#EAE8D9] rounded-3xl flex flex-col sm:flex-row items-center gap-4 shadow-inner">
              <div className="space-y-1.5 text-center sm:text-left">
                <h5 className="text-xs font-sans font-bold uppercase tracking-widest text-[#4A4A40] flex items-center justify-center sm:justify-start gap-1">
                  👄 {t.mouthLipSync}
                </h5>
                <p className="text-[11px] text-[#4A4A40]/70 max-w-[200px] leading-relaxed font-sans">
                  Watch the animated model to copy mouth movements and correct placement for <strong>{selectedWord.word}</strong>.
                </p>
              </div>

              {/* Mouth visualization box */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-[#EAE8D9] rounded-2xl w-28 h-28 shrink-0 shadow-sm">
                <span className="text-[8px] font-mono text-[#5A5A40] uppercase tracking-widest mb-1">Mouth Shape</span>
                <div className="w-16 h-10 flex items-center justify-center relative">
                  <svg viewBox="0 0 100 60" className="w-14 h-8 transition-all duration-200">
                    {activeViseme === 'open' && (
                      <ellipse cx="50" cy="30" rx="20" ry="14" fill="#5A5A40" />
                    )}
                    {activeViseme === 'closed' && (
                      <line x1="15" y1="30" x2="85" y2="30" stroke="#5A5A40" strokeWidth="8" strokeLinecap="round" />
                    )}
                    {activeViseme === 'wide' && (
                      <path d="M 15,30 Q 50,45 85,30 Q 50,22 15,30 Z" fill="#5A5A40" />
                    )}
                    {activeViseme === 'neutral' && (
                      <path d="M 22,30 Q 50,38 78,30 Q 50,28 22,30 Z" fill="#5A5A40" />
                    )}
                    {activeViseme === 'ah' && (
                      <circle cx="50" cy="30" r="18" fill="#5A5A40" />
                    )}
                    {activeViseme === 'oo' && (
                      <circle cx="50" cy="30" r="10" fill="#5A5A40" />
                    )}
                  </svg>
                </div>
                <span className="text-[9px] font-sans font-black bg-[#FAF6EC] text-[#5A5A40] px-2 py-0.5 rounded border border-[#EAE8D9] mt-1 uppercase">
                  {activeViseme}
                </span>
              </div>
            </div>

            {/* Articulation Speed Settings */}
            <div className="p-5 bg-[#FAF9F5] border border-[#EAE8D9] rounded-3xl flex flex-col justify-center space-y-3 shadow-inner">
              <h5 className="text-xs font-sans font-bold uppercase tracking-widest text-[#4A4A40]">
                🐢 {t.articulationSpeed}
              </h5>
              <p className="text-[11px] text-[#4A4A40]/70 leading-relaxed font-sans">
                Adjust speed controls to assist speech processing.
              </p>
              
              <div className="grid grid-cols-3 gap-2 bg-[#F5F2EB] p-1 rounded-full border border-[#D9D7C8]">
                <button
                  id="speed-slower"
                  onClick={() => { playSensoryChime('click'); setSpeed('slower'); }}
                  className={`text-xs py-2 rounded-full font-sans font-bold transition-all cursor-pointer ${
                    speed === 'slower' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#4A4A40]/70 hover:text-[#2D2D2A]'
                  }`}
                >
                  🐢 {t.slow}
                </button>
                <button
                  id="speed-natural"
                  onClick={() => { playSensoryChime('click'); setSpeed('natural'); }}
                  className={`text-xs py-2 rounded-full font-sans font-bold transition-all cursor-pointer ${
                    speed === 'natural' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#4A4A40]/70 hover:text-[#2D2D2A]'
                  }`}
                >
                  🐇 {t.natural}
                </button>
                <button
                  id="speed-fast"
                  onClick={() => { playSensoryChime('click'); setSpeed('fast'); }}
                  className={`text-xs py-2 rounded-full font-sans font-bold transition-all cursor-pointer ${
                    speed === 'fast' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#4A4A40]/70 hover:text-[#2D2D2A]'
                  }`}
                >
                  ⚡ {t.fast}
                </button>
              </div>
            </div>

          </div>

          {/* Adaptive Demonstration Panel ("No Demo Every Round") */}
          <div className="bg-[#FAF9F3] border border-[#EAE8D9] rounded-3xl p-6 space-y-4">
            <h4 className="text-[10px] font-sans font-bold tracking-wider uppercase text-[#4A4A40]/60">
              🎓 {t.lessonStep} {(wordAttempts[selectedWord.id] || 0)}
            </h4>

            {/* Case 1: First Attempt (Full Demo Mode) */}
            {(wordAttempts[selectedWord.id] || 0) === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900">
                  <span className="text-3xl select-none">🧒</span>
                  <div className="space-y-1">
                    <p className="text-sm font-sans font-bold">{t.avatarDemo}</p>
                    <p className="text-xs text-stone-500 font-sans leading-relaxed">
                      {t.avatarDemoDesc}
                    </p>
                  </div>
                </div>
                
                <div className="p-5 rounded-2xl border-2 border-[#EAE8D9] bg-white flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[9px] font-sans font-bold text-[#4A4A40]/60 uppercase tracking-widest block">{t.practiceSentence}</span>
                    <span className="text-lg font-serif italic text-[#2D2D2A] block mt-1 leading-tight">
                      "{selectedWord.example}"
                    </span>
                  </div>
                  <button
                    id="speak-sentence-btn"
                    onClick={() => triggerRepeatExample(selectedWord)}
                    className="p-3 rounded-full bg-[#FAF6EC] border border-[#EADAC2] text-[#5A5A40] hover:bg-[#FAF9F3] transition-all cursor-pointer active:scale-90"
                    title={t.hearSentence}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Case 2: Second Attempt (Small Reminder Mode) */}
            {(wordAttempts[selectedWord.id] || 0) === 2 && (
              <div className="space-y-3">
                <div className="flex gap-3 p-4 rounded-2xl bg-[#E9F1F0] border border-[#D1E1DF] text-[#2D5A56]">
                  <span className="text-xl select-none">💡</span>
                  <p className="text-xs font-sans">
                    <strong>{t.quickReminder}</strong> {t.reminderDesc} <span className="font-bold font-serif text-[#2D5A56]">"{selectedWord.word}"</span>!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    id="trigger-repeat-word-btn"
                    onClick={() => triggerRepeatVoice(selectedWord)}
                    className="text-xs font-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F3] border-2 border-[#EAE8D9] text-[#4A4A40] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    🔊 {t.hearWord}
                  </button>
                  <button
                    id="trigger-repeat-sentence-btn"
                    onClick={() => triggerRepeatExample(selectedWord)}
                    className="text-xs font-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F3] border-2 border-[#EAE8D9] text-[#4A4A40] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    🗣️ {t.hearSentence}
                  </button>
                </div>
              </div>
            )}

            {/* Case 3: Third Attempt and onwards (No Demo, instant control) */}
            {(wordAttempts[selectedWord.id] || 0) >= 3 && (
              <div className="space-y-3">
                <p className="text-xs text-[#4A4A40]/70 font-sans leading-relaxed">
                  🚀 <strong>{t.noWaiting}</strong> {t.noWaitingDesc}
                </p>
                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <button
                    id="trigger-manual-tts-btn"
                    onClick={() => triggerRepeatVoice(selectedWord)}
                    className="bg-[#E9F1F0] border-2 border-[#D1E1DF] text-[#2D5A56] font-sans font-bold uppercase tracking-widest px-5 py-3 rounded-full text-[10px] flex items-center gap-2 hover:bg-[#DEEBEA] transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    🔊 {t.repeatWord}: "{selectedWord.word}"
                  </button>
                  <button
                    id="trigger-manual-sentence-btn"
                    onClick={() => triggerRepeatExample(selectedWord)}
                    className="bg-white border-2 border-[#EAE8D9] text-[#4A4A40] font-sans font-bold uppercase tracking-widest px-5 py-3 rounded-full text-[10px] flex items-center gap-2 hover:bg-[#FAF9F5] transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    🗣️ {t.speakSentence}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Real-World Montessori Practice Guide Card */}
          <div className="p-5 rounded-3xl bg-[#FAF6EC] border-2 border-[#EADAC2] space-y-2">
            <h5 className="text-xs font-sans font-bold uppercase tracking-widest text-[#7D5A2E] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#7D5A2E] stroke-none animate-pulse" />
              {t.montessoriHome}
            </h5>
            <p className="text-xs text-[#7D5A2E] leading-relaxed font-sans font-medium">
              {t.montessoriHomeDesc}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
