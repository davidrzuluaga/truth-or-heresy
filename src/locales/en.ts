import { HeresyName } from "../types";

const heresy = (name: HeresyName, tagline: string, council: string) => ({
  name,
  tagline,
  council,
});

export default {
  meta: {
    appTitle: "Truth or Heresy?",
  },
  home: {
    eyebrow: "The Theology Quiz",
    titleLine1: "Truth or",
    titleLine2: "Heresy?",
    taglineLine1: "Spot true doctrine from",
    taglineLine2: "ancient errors",
    startQuiz: "Start Quiz",
    footerHint:
      "Can you tell the ancient councils from the ancient chaos?",
    statsLine: "21 statements · 7 classic heresies",
    languageLabel: "Language",
  },
  screens: {
    quiz: { title: "Truth or Heresy?" },
    heresySelector: { title: "Name That Heresy!" },
    explanation: { title: "The Verdict" },
    settings: { title: "Settings" },
  },
  quiz: {
    truth: "Truth",
    truthSub: "This is orthodox doctrine",
    heresy: "Heresy!",
    heresySub: "This contradicts the faith",
  },
  heresySelector: {
    headline: "Name That Heresy!",
    sub: "Which specific heresy is lurking in this statement?",
  },
  scoreHeader: {
    score: "Score",
    accuracy: "Accuracy",
    streak: "Streak",
  },
  questionCard: {
    question: "Question {{n}}",
    hint: "Is this Truth or Heresy?",
  },
  explanation: {
    correct: "✨ Correct!",
    wrong: "⚔️ Heresy Detected!",
    orthodoxLine:
      "This statement is solid orthodox teaching — a Truth!",
    heresyLine: "This is the heresy of {{heresy}}.",
    wrongGuess:
      'You named {{guess}} — close, but the answer was {{correct}}.',
    statementLabel: "The Statement",
    councilWeighs: "The Council Weighs In",
    consulting: "Consulting the ancient councils…",
    explanationUnavailable: "Explanation unavailable",
    goToSettings: "Go to Settings",
    nextQuestion: "Next Question",
    score: "Score",
    streak: "Streak",
    accuracy: "Accuracy",
    noApiKey:
      "No API key found. Tap below to add your Anthropic key in Settings.",
    genericError: "Something went wrong.",
  },
  summary: {
    gameOver: "Game Over",
    correct: "Correct",
    attempted: "Attempted",
    accuracy: "Accuracy",
    bestStreak: "Best Streak",
    playAgain: "Play Again",
    backHome: "Back to Home",
    grades: {
      S: {
        label: "Council-Worthy!",
        message:
          "The ancient councils would have you as a delegate. Nicaea would not be complete without you.",
      },
      A: {
        label: "Solid Theologian!",
        message:
          "Augustine would give you a nod. A few more pages of Athanasius and you'll be unstoppable.",
      },
      B: {
        label: "Promising Student!",
        message:
          "You know your way around a creed, but a couple of heresies slipped past the guards.",
      },
      C: {
        label: "Keep Studying!",
        message:
          "The heresies are winning. They're clever, ancient, and slightly better at this than you were today.",
      },
      F: {
        label: "Heresy Suspect…",
        message:
          "Alarming. Arius himself couldn't have done worse. Try reading the Nicene Creed before your next attempt.",
      },
    },
  },
  settings: {
    apiKeyTitle: "Anthropic API Key",
    keyStored: "✓ Key stored",
    description:
      "This app uses Claude AI to generate explanations after every answer. Get your free key at {{link}} — it only takes 30 seconds.",
    linkLabel: "console.anthropic.com",
    placeholder: "sk-ant-api03-...",
    saveKey: "Save API Key",
    saved: "Saved!",
    about: "About",
    aboutBody:
      "Truth or Heresy? tests your knowledge of Christian doctrine and the 7 classic heresies condemned by the early church councils — from Nicaea to Ephesus. Each explanation is generated live by Claude AI so no two sessions are quite alike.",
    poweredBy: "Powered by claude-3-5-sonnet-20241022",
    privacy:
      "Your API key is stored only on this device using encrypted local storage. It is never sent anywhere except directly to Anthropic's API.",
    alertMissingTitle: "Missing key",
    alertMissingBody: "Please paste your Anthropic API key first.",
    alertInvalidTitle: "Invalid key",
    alertInvalidBody:
      'Anthropic API keys start with "sk-". Double-check your key.',
  },
  heresies: {
    Arianism: heresy(
      "Arianism",
      "Jesus is a created, lesser being",
      "Condemned at Nicaea 325 AD"
    ),
    Pelagianism: heresy(
      "Pelagianism",
      "Humans can earn salvation by willpower",
      "Condemned at Carthage 418 AD"
    ),
    Gnosticism: heresy(
      "Gnosticism",
      "Secret knowledge saves; matter is evil",
      "Opposed by early fathers, 2nd–3rd c."
    ),
    Modalism: heresy(
      "Modalism",
      "God wears three masks, not three persons",
      "Rejected by 3rd-century church"
    ),
    Docetism: heresy(
      "Docetism",
      "Jesus only seemed to be human",
      "Opposed by Ignatius, c. 107 AD"
    ),
    Nestorianism: heresy(
      "Nestorianism",
      "Christ is two separate persons",
      "Condemned at Ephesus 431 AD"
    ),
    Marcionism: heresy(
      "Marcionism",
      "OT God ≠ NT God; ditch the OT",
      "Excommunicated Marcion, 144 AD"
    ),
  },
  questions: {
    "1": {
      statement:
        "Jesus Christ possesses two complete natures — fully divine and fully human — united in one person without mixture, confusion, or separation.",
    },
    "2": {
      statement:
        "Salvation is entirely by grace through faith — a gift from God, not earned through human effort, moral achievement, or free will alone.",
    },
    "3": {
      statement:
        "God eternally exists as three distinct persons — Father, Son, and Holy Spirit — who share one divine essence equally and fully.",
    },
    "4": {
      statement:
        "Jesus Christ physically rose from the dead in a glorified but genuinely bodily resurrection on the third day.",
    },
    "5": {
      statement:
        "The Son is eternally begotten of the Father, not made or created — he is of the same divine substance as the Father.",
    },
    "6": {
      statement:
        "The Holy Spirit is a distinct divine person who proceeds from the Father, and is co-worshipped and co-glorified with the Father and the Son.",
    },
    "7": {
      statement:
        "At the incarnation, the eternal Son of God took on genuine human flesh and a full human nature, while remaining fully and completely divine.",
    },
    "8": {
      statement:
        "The Son of God was the first and greatest of all God's creations — exalted above all others, yet still a creature with a beginning in time.",
    },
    "9": {
      statement:
        "There was a time when the Son was not. Before the Father created him, the Son did not exist — making him ultimately subordinate to and lesser than the Father.",
    },
    "10": {
      statement:
        "Human beings are born morally neutral and possess the natural ability to choose good and obey God's commands without any need for divine grace.",
    },
    "11": {
      statement:
        "Original sin affected Adam alone. His descendants sin by choosing to imitate his bad example, not because of any inherited corruption or fallen nature.",
    },
    "12": {
      statement:
        "The physical world was crafted by an ignorant, lesser deity called the Demiurge. True salvation means escaping matter through secret spiritual knowledge revealed only to the enlightened.",
    },
    "13": {
      statement:
        "The body is a prison for the divine spark within. Those who receive hidden gnosis — sacred knowledge unknown to the masses — can transcend material existence and return to the true God.",
    },
    "14": {
      statement:
        "The Father, Son, and Holy Spirit are not truly distinct persons, but three different modes or 'masks' that the one God wears at different times — like one actor playing three roles.",
    },
    "15": {
      statement:
        "God is a single divine person who expresses himself as Father in creation, as Son in redemption, and as Spirit in sanctification — three roles, but ultimately one undivided self.",
    },
    "16": {
      statement:
        "Jesus only appeared to have a physical body. Being purely divine, he could not truly take on corruptible flesh — his humanity was a convincing illusion, like a divine hologram.",
    },
    "17": {
      statement:
        "The divine Christ could not truly suffer or die on the cross. What onlookers witnessed was an appearance of suffering — the eternal God remained completely untouched by physical pain or death.",
    },
    "18": {
      statement:
        "Mary should be called 'Mother of Christ,' not 'Mother of God,' because she only gave birth to the human person Jesus — not to the divine Son of God himself.",
    },
    "19": {
      statement:
        "In Jesus, there are two complete and distinct persons — one divine and one human — dwelling together in perfect moral harmony, like a divine person inhabiting and directing a human person.",
    },
    "20": {
      statement:
        "The harsh, vengeful God of the Old Testament is an entirely different deity from the loving Father that Jesus revealed. Jesus came to liberate humanity from the old God's law and wrath.",
    },
    "21": {
      statement:
        "The Old Testament scriptures belong to an inferior religion entirely. The true God had nothing to do with the Jewish people — Jesus brought a completely fresh message from a higher, previously unknown God.",
    },
  },
};
