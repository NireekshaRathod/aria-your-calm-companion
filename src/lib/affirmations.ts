// ARIA Affirmations Library
export const affirmations = {
  general: [
    "You're allowed to move at your own pace.",
    "This feeling will pass.",
    "You're doing the best you can.",
    "You are safe in this moment.",
    "It's okay to take things one step at a time.",
    "You deserve kindness, especially from yourself.",
    "Your feelings are valid.",
    "You don't have to have it all figured out.",
    "Small steps still count as progress.",
    "You are worthy of love and care.",
    "It's okay to rest.",
    "You're stronger than you think.",
    "This moment is temporary.",
    "You are enough, just as you are.",
    "Your presence matters.",
  ],
  happy: [
    "Your joy is a gift to yourself and others.",
    "You deserve to feel this good.",
    "Let this moment fill you with gratitude.",
    "Happiness looks beautiful on you.",
    "Embrace this feeling fully.",
    "You've created space for joy in your life.",
    "This happiness is yours to keep.",
  ],
  okay: [
    "Neutral days are part of the journey.",
    "It's perfectly fine to just be okay.",
    "You don't always need to feel amazing.",
    "Balance is a form of peace.",
    "Quiet moments have their own beauty.",
    "You're doing fine, and that's enough.",
  ],
  sad: [
    "It's okay to feel sad sometimes.",
    "Your tears are a form of release.",
    "This sadness won't last forever.",
    "You are not alone in how you feel.",
    "Be gentle with yourself today.",
    "Sadness is just one color in your emotional rainbow.",
    "You are allowed to feel deeply.",
  ],
  stressed: [
    "Take a deep breath. You've got this.",
    "One thing at a time.",
    "Stress is temporary, your strength is permanent.",
    "You don't have to solve everything right now.",
    "Give yourself permission to pause.",
    "You've handled difficult things before.",
    "Release what you cannot control.",
  ],
  overwhelmed: [
    "You don't need to do anything right now.",
    "Just breathe. That's enough.",
    "It's okay to step back.",
    "You are safe in this moment.",
    "Let everything else wait.",
    "Right now, just be.",
    "Nothing is more important than your peace.",
  ],
};

export const getRandomAffirmation = (mood?: string): string => {
  const moodAffirmations = mood && affirmations[mood as keyof typeof affirmations]
    ? affirmations[mood as keyof typeof affirmations]
    : affirmations.general;
  
  return moodAffirmations[Math.floor(Math.random() * moodAffirmations.length)];
};

export const silentSupportMessages = [
  "You don't have to do anything right now.",
  "I'm here with you.",
  "Just breathe.",
  "You're safe right now.",
  "Take all the time you need.",
  "This moment is just for you.",
  "No expectations. Just presence.",
  "You're not alone.",
  "Rest if you need to.",
  "Everything else can wait.",
  "You don't need to explain anything.",
  "Just be. That's enough.",
  "I'm sitting with you in silence.",
  "You are held in this moment.",
  "Let the world fade for now.",
];