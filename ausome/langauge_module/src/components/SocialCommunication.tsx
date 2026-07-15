import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { Sparkles, Trophy, MessageSquare, ArrowRight, Volume2, ShieldCheck, Heart } from 'lucide-react';

interface SocialCommunicationProps {
  langCode: LanguageCode;
  addStarsAndCoins: (stars: number, coins: number) => void;
  unlockedBadgeIds: string[];
  unlockBadge: (badgeId: string) => void;
  voicePack: string;
}

interface ScenarioStep {
  text: string; // Avatar prompt spoken & written
  character: string; // Emoji
  avatarName: string;
  expectedInput: 'aac-eat' | 'sentence-build' | 'pay' | 'thank-you' | 'aac-play' | 'aac-toy' | 'aac-help' | 'calm-strategy';
  options: Array<{ id: string; label: string; emoji: string; textToSpeak?: string }>;
}

interface Scenario {
  id: string;
  title: string;
  badgeName: string;
  badgeEmoji: string;
  summary: string;
  steps: ScenarioStep[];
}

export default function SocialCommunication({
  langCode,
  addStarsAndCoins,
  unlockedBadgeIds,
  unlockBadge,
  voicePack,
}: SocialCommunicationProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [storyLog, setStoryLog] = useState<string[]>([]);

  const SCENARIOS: Scenario[] = [
    {
      id: 'restaurant',
      title: '🍕 The Cozy Restaurant Challenge',
      badgeName: 'Junior Chef',
      badgeEmoji: '🍕',
      summary: 'Practice entering a restaurant, ordering sweet food, paying with wooden coins, and saying thank you.',
      steps: [
        {
          text: langCode === 'es' ? 'Tengo mucha hambre. ¿Qué hacemos?' : 
                langCode === 'de' ? 'Ich bin sehr hungrig. Was machen wir?' :
                langCode === 'zh' ? '我很饿。我们该做什么？' :
                langCode === 'ar' ? 'أنا جائع جداً. ماذا نفعل؟' :
                'I am very hungry. What should we do?',
          character: '🦊',
          avatarName: 'Pip',
          expectedInput: 'aac-eat',
          options: [
            { id: 'opt_sleep', label: 'Sleep 😴', emoji: '😴', textToSpeak: 'Sleep' },
            { id: 'opt_eat', label: 'Eat 🍎', emoji: '🍎', textToSpeak: 'Eat' },
            { id: 'opt_toilet', label: 'Toilet 🚽', emoji: '🚽', textToSpeak: 'Toilet' },
          ],
        },
        {
          text: langCode === 'es' ? '¡Excelente! Pidamos comida usando el constructor.' :
                langCode === 'de' ? 'Ausgezeichnet! Lass uns Essen mit dem Satzbauer bestellen.' :
                langCode === 'zh' ? '太棒了！让我们用句子构建器点餐。' :
                langCode === 'ar' ? 'ممتاز! لنطلب الطعام باستخدام مركب الجمل.' :
                'Excellent choice! Let\'s order some food now.',
          character: '👩‍🍳',
          avatarName: 'Waiter',
          expectedInput: 'sentence-build',
          options: [
            { id: 'opt_s1', label: '"I want apple" 🙋🍎', emoji: '🍎', textToSpeak: 'I want apple' },
            { id: 'opt_s2', label: '"I feel sad" 😢', emoji: '😢', textToSpeak: 'I feel sad' },
            { id: 'opt_s3', label: '"Let\'s play" 🪁', emoji: '🪁', textToSpeak: 'Let\'s play' },
          ],
        },
        {
          text: langCode === 'es' ? 'Aquí tienes tu comida. Eso cuesta una moneda de madera.' :
                langCode === 'de' ? 'Hier ist dein Essen. Das kostet eine Holzmünze.' :
                langCode === 'zh' ? '这是您的食物。这需要一枚木质硬币。' :
                langCode === 'ar' ? 'تفضل طعامك. هذا يكلف عملة خشبية واحدة.' :
                'Here is your delicious food. That will be one wooden coin.',
          character: '👩‍🍳',
          avatarName: 'Waiter',
          expectedInput: 'pay',
          options: [
            { id: 'pay_coin', label: 'Give 1 Wooden Coin 🪙', emoji: '🪙', textToSpeak: 'Here is your coin' },
            { id: 'pay_ignore', label: 'Look away 🫣', emoji: '🫣', textToSpeak: 'Look away' },
          ],
        },
        {
          text: langCode === 'es' ? '¡Muchas gracias por la moneda! Disfruta la comida.' :
                langCode === 'de' ? 'Vielen Dank für die Münze! Guten Appetit.' :
                langCode === 'zh' ? '非常感谢您的硬币！祝您用餐愉快。' :
                langCode === 'ar' ? 'شكراً جزيلاً لك على العملة! استمتع بالطعام.' :
                'Thank you so much for the coin! Enjoy your sweet meal.',
          character: '🦊',
          avatarName: 'Pip',
          expectedInput: 'thank-you',
          options: [
            { id: 'ty_finished', label: 'Finished ✅', emoji: '✅', textToSpeak: 'Finished' },
            { id: 'ty_thanks', label: 'Thank You 🙏', emoji: '🙏', textToSpeak: 'Thank You' },
            { id: 'ty_close', label: 'Close 🔒', emoji: '🔒', textToSpeak: 'Close' },
          ],
        },
      ],
    },
    {
      id: 'playground',
      title: '🪁 Friendly Playground turn-taking',
      badgeName: 'Playground Pal',
      badgeEmoji: '🪁',
      summary: 'Practice greeting a friend, choosing an active toy, sharing, and expressing when you want more or are finished.',
      steps: [
        {
          text: langCode === 'es' ? '¡Hola! ¿Quieres jugar conmigo en el parque?' :
                langCode === 'de' ? 'Hallo! Möchtest du mit mir im Park spielen?' :
                langCode === 'zh' ? '你好！你想在公园里和我玩吗？' :
                langCode === 'ar' ? 'مرحباً! هل تريد اللعب معي في الحديقة؟' :
                'Hello! Would you like to play with me in the park?',
          character: '🐼',
          avatarName: 'Sammy',
          expectedInput: 'aac-play',
          options: [
            { id: 'play_yes', label: 'Play 🧸', emoji: '🧸', textToSpeak: 'Play' },
            { id: 'play_no', label: 'Stop 🛑', emoji: '🛑', textToSpeak: 'Stop' },
          ],
        },
        {
          text: langCode === 'es' ? '¿Qué juguete deberíamos usar hoy?' :
                langCode === 'de' ? 'Welches Spielzeug sollten wir heute benutzen?' :
                langCode === 'zh' ? '今天我们应该用什么玩具？' :
                langCode === 'ar' ? 'أي لعبة يجب أن نستخدمها اليوم؟' :
                'What toy should we use today?',
          character: '🐼',
          avatarName: 'Sammy',
          expectedInput: 'aac-toy',
          options: [
            { id: 'toy_apple', label: 'Apple 🍎', emoji: '🍎', textToSpeak: 'Apple' },
            { id: 'toy_kite', label: 'Toy 🪁', emoji: '🪁', textToSpeak: 'Toy' },
            { id: 'toy_chair', label: 'Chair 🪑', emoji: '🪑', textToSpeak: 'Chair' },
          ],
        },
        {
          text: langCode === 'es' ? '¡Me encanta el juguete! ¿Quieres otro turno o terminamos?' :
                langCode === 'de' ? 'Ich liebe das Spielzeug! Möchtest du noch einen Zug oder sind wir fertig?' :
                langCode === 'zh' ? '我喜欢这个玩具！你还要玩一轮还是结束？' :
                langCode === 'ar' ? 'أنا أحب اللعبة! هل تريد دوراً آخر أم انتهينا؟' :
                'I love this toy! Do you want another turn, or are you finished?',
          character: '🐼',
          avatarName: 'Sammy',
          expectedInput: 'thank-you',
          options: [
            { id: 'play_more', label: 'More ➕', emoji: '➕', textToSpeak: 'More' },
            { id: 'play_fin', label: 'Finished ✅', emoji: '✅', textToSpeak: 'Finished' },
          ],
        },
      ],
    },
    {
      id: 'sensory_overload',
      title: '🌿 Soft Calming Sensory Challenge',
      badgeName: 'Calm Master',
      badgeEmoji: '🌿',
      summary: 'Learn what to do when background noises or rooms feel too loud or overwhelming.',
      steps: [
        {
          text: langCode === 'es' ? '¡Oh no! Hay un ruido muy fuerte afuera. Me asusta.' :
                langCode === 'de' ? 'Oh nein! Draußen ist ein sehr lautes Geräusch. Ich habe Angst.' :
                langCode === 'zh' ? '哦，不！外面有一声巨响。我很害怕。' :
                langCode === 'ar' ? 'أوه لا! هناك صوت عالٍ جداً في الخارج. أنا خائف.' :
                'Oh no! There is a very loud drilling sound outside. It is scaring me.',
          character: '🐰',
          avatarName: 'Bella',
          expectedInput: 'aac-help',
          options: [
            { id: 'over_help', label: 'Help 🆘', emoji: '🆘', textToSpeak: 'Help' },
            { id: 'over_eat', label: 'Eat 🍎', emoji: '🍎', textToSpeak: 'Eat' },
            { id: 'over_stop', label: 'Stop 🛑', emoji: '🛑', textToSpeak: 'Stop' },
          ],
        },
        {
          text: langCode === 'es' ? '¿Qué estrategia podemos usar para sentirnos tranquilos?' :
                langCode === 'de' ? 'Welche Strategie können wir anwenden, um uns ruhig zu fühlen?' :
                langCode === 'zh' ? '我们能用什么方法让自己平静下来？' :
                langCode === 'ar' ? 'ما هي الاستراتيجية التي يمكننا استخدامها للشعور بالهدوء؟' :
                'What strategy can we use to feel safe and quiet?',
          character: '🐰',
          avatarName: 'Bella',
          expectedInput: 'calm-strategy',
          options: [
            { id: 'strat_noise', label: 'Put on Headphones 🎧', emoji: '🎧', textToSpeak: 'Headphones please' },
            { id: 'strat_room', label: 'Go to Quiet Cozy Bedroom 🛌', emoji: '🛌', textToSpeak: 'Quiet room' },
            { id: 'strat_breathe', label: 'Take 3 deep breaths 💨', emoji: '💨', textToSpeak: 'Breathe' },
          ],
        },
        {
          text: langCode === 'es' ? '¡Me siento mucho mejor ahora! Gracias.' :
                langCode === 'de' ? 'Ich fühle mich jetzt viel besser! Danke.' :
                langCode === 'zh' ? '我现在感觉好多了！谢谢。' :
                langCode === 'ar' ? 'أشعر بتحسن كبير الآن! شكراً لك.' :
                'I feel so much better and calmer now! Thank you.',
          character: '🐰',
          avatarName: 'Bella',
          expectedInput: 'thank-you',
          options: [
            { id: 'calm_thanks', label: 'Thank You 🙏', emoji: '🙏', textToSpeak: 'Thank You' },
            { id: 'calm_feel', label: 'I feel calm 🌿', emoji: '🌿', textToSpeak: 'I feel calm' },
          ],
        },
      ],
    },
  ];

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId);

  const startScenario = (scenarioId: string) => {
    playSensoryChime('click');
    setSelectedScenarioId(scenarioId);
    setCurrentStepIndex(0);
    setStoryLog([]);
    
    // Auto speak the first step prompt
    const firstStep = SCENARIOS.find((s) => s.id === scenarioId)?.steps[0];
    if (firstStep) {
      speakText(firstStep.text, langCode, voicePack);
    }
  };

  const handleOptionClick = (option: { id: string; label: string; emoji: string; textToSpeak?: string }) => {
    if (!activeScenario) return;
    
    playSensoryChime('click');
    const currentStep = activeScenario.steps[currentStepIndex];

    // Read option out loud instantly
    if (option.textToSpeak) {
      speakText(option.textToSpeak, langCode, voicePack);
    }

    // Add to localized log
    setStoryLog([...storyLog, `Selected: ${option.label}`]);

    // Go to next step or complete
    if (currentStepIndex < activeScenario.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      
      // Speak next prompt after brief pause
      setTimeout(() => {
        const nextStep = activeScenario.steps[nextIndex];
        speakText(nextStep.text, langCode, voicePack);
      }, 1000);
    } else {
      // Completed Scenario!
      playSensoryChime('success');
      addStarsAndCoins(20, 10); // Massive reward for complete story
      unlockBadge(activeScenario.id);
      setCompletedScenarios([...completedScenarios, activeScenario.id]);
      setCurrentStepIndex(activeScenario.steps.length); // Out of bounds indicator for complete
    }
  };

  return (
    <div id="social-stories-container" className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Scenarios Catalog */}
      {!selectedScenarioId && (
        <div className="space-y-6">
          <div className="p-6 rounded-[32px] bg-white border-2 border-[#EAE8D9]">
            <h2 className="text-2xl font-serif font-light text-[#2D2D2A] flex items-center gap-2">
              😊 Social Communication Scenarios
            </h2>
            <p className="text-xs text-[#4A4A40]/80 mt-1 font-sans">
              Step into autism-friendly social stories. Navigate real-world situations, practice ordering, sharing, and calming routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCENARIOS.map((sc) => {
              const isCompleted = completedScenarios.includes(sc.id) || unlockedBadgeIds.includes(sc.id);
              return (
                <div
                  key={sc.id}
                  className="bg-white border-2 border-[#EAE8D9] hover:border-[#5A5A40] p-6 rounded-[40px] flex flex-col justify-between space-y-4 shadow-sm transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl select-none">
                        {sc.badgeEmoji}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] font-sans font-bold bg-teal-50 border border-teal-200 text-teal-800 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                          👑 Complete
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#2D2D2A] tracking-tight leading-tight">
                      {sc.title}
                    </h3>
                    <p className="text-xs text-[#4A4A40]/80 leading-relaxed font-sans">
                      {sc.summary}
                    </p>
                  </div>

                  <button
                    id={`start-scenario-btn-${sc.id}`}
                    onClick={() => startScenario(sc.id)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest py-3 rounded-full text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <span>Play Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Active Interactive Scenario Screen */}
      {selectedScenarioId && activeScenario && (
        <div className="bg-white border-2 border-[#EAE8D9] rounded-[40px] p-6 md:p-8 space-y-6 shadow-sm animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EAE8D9] pb-4">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#4A4A40]/60 uppercase block">
                Active Story Challenge
              </span>
              <h3 className="text-xl font-serif text-[#2D2D2A] tracking-tight">
                {activeScenario.title}
              </h3>
            </div>
            <button
              id="quit-scenario-btn"
              onClick={() => {
                playSensoryChime('click');
                setSelectedScenarioId(null);
              }}
              className="text-xs font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-full border-2 border-[#EAE8D9] bg-white text-[#4A4A40] hover:bg-[#FAF9F3] transition-all cursor-pointer"
            >
              Quit Story
            </button>
          </div>

          {/* Core Interactive Step (Or Complete state) */}
          {currentStepIndex < activeScenario.steps.length ? (
            <div className="space-y-6">
              
              {/* Character Prompt speech bubble */}
              <div className="flex gap-4 items-start bg-[#FAF9F3] border border-[#EAE8D9] p-6 rounded-[32px] shadow-sm">
                {/* Large high-contrast avatar */}
                <div className="w-16 h-16 rounded-full bg-white border border-[#EAE8D9] flex items-center justify-center text-3xl shrink-0 shadow-inner select-none animate-pulse">
                  {activeScenario.steps[currentStepIndex].character}
                </div>
                
                <div className="space-y-1.5 flex-1">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#4A4A40]/60">
                    {activeScenario.steps[currentStepIndex].avatarName} says:
                  </span>
                  <p className="text-lg font-serif italic text-[#2D2D2A] tracking-tight leading-relaxed">
                    "{activeScenario.steps[currentStepIndex].text}"
                  </p>
                  
                  {/* Speaker helper button */}
                  <button
                    id="scenario-prompt-speak-btn"
                    onClick={() => speakText(activeScenario.steps[currentStepIndex].text, langCode, voicePack)}
                    className="flex items-center gap-1 text-xs font-sans font-bold text-teal-600 hover:text-teal-850 py-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Repeat Question</span>
                  </button>
                </div>
              </div>

              {/* Interaction Choices Grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4A4A40]/60 block">
                  Select your response:
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeScenario.steps[currentStepIndex].options.map((opt) => (
                    <button
                      key={opt.id}
                      id={`scenario-option-${opt.id}`}
                      onClick={() => handleOptionClick(opt)}
                      className="bg-white border-2 border-[#EAE8D9] hover:border-[#5A5A40] p-5 rounded-[24px] text-left font-sans font-bold text-[#2D2D2A] text-sm flex items-center gap-3 active:scale-97 hover:scale-101 cursor-pointer transition-all shadow-sm"
                    >
                      <span className="text-2xl select-none">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            // Story complete screen
            <div className="text-center py-8 px-4 space-y-6 max-w-md mx-auto">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-amber-200/20 blur-2xl rounded-full scale-125" />
                <div className="relative w-28 h-28 rounded-full bg-[#FAF6EC] border-2 border-[#EADAC2] flex items-center justify-center text-6xl shadow-md mx-auto animate-bounce select-none">
                  {activeScenario.badgeEmoji}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-serif font-light text-[#2D2D2A] tracking-tight">
                  Congratulations!
                </h4>
                <p className="text-xs text-[#4A4A40]/80 font-sans">
                  You completed <strong>{activeScenario.title}</strong> and navigated the social interactions perfectly!
                </p>
              </div>

              {/* Reward Box */}
              <div className="p-5 rounded-[32px] bg-[#E9F1F0] border-2 border-[#D1E1DF] text-[#2D5A56] flex justify-center items-center gap-6">
                <div className="text-center">
                  <span className="block text-2xl font-serif font-bold">⭐ +20</span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-85">Stars Earned</span>
                </div>
                <div className="w-px h-8 bg-[#D1E1DF]" />
                <div className="text-center">
                  <span className="block text-2xl font-serif font-bold">🪙 +10</span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-85">Coins Earned</span>
                </div>
                <div className="w-px h-8 bg-[#D1E1DF]" />
                <div className="text-center flex flex-col items-center">
                  <ShieldCheck className="w-6 h-6 text-[#2D5A56]" />
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-85 mt-1">Badge Unlocked</span>
                </div>
              </div>

              {/* Montessori real-life follow up activity */}
              <div className="p-5 rounded-[24px] bg-[#FAF6EC] border-2 border-[#EADAC2] text-left space-y-1">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#7D5A2E] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#7D5A2E] stroke-none animate-pulse" />
                  Home Practice Idea
                </span>
                <p className="text-xs text-[#7D5A2E] leading-relaxed font-sans font-medium">
                  Now try this in real life! Make a simple setup with 3 objects on a table. Play "Store" with wood block blocks or real coins, practice ordering, paying, and saying <strong>"Thank you"</strong> together.
                </p>
              </div>

              <button
                id="finish-scenario-return-btn"
                onClick={() => {
                  playSensoryChime('click');
                  setSelectedScenarioId(null);
                }}
                className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-wider rounded-full cursor-pointer text-xs shadow-sm transition-all"
              >
                Return to Scenarios
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
