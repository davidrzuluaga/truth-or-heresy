import { Question } from "./types";

/**
 * 21 high-quality theological statements — 7 orthodox truths and 14 heresies
 * (2 per each of the 7 classic heresies condemned by the early councils).
 */
export const QUESTIONS: Question[] = [
  // ── Orthodox Truth (7) ────────────────────────────────────────────────────

  {
    id: 1,
    statement:
      "Jesus Christ possesses two complete natures — fully divine and fully human — united in one person without mixture, confusion, or separation.",
    isTruth: true,
    correctHeresy: null,
  },
  {
    id: 2,
    statement:
      "Salvation is entirely by grace through faith — a gift from God, not earned through human effort, moral achievement, or free will alone.",
    isTruth: true,
    correctHeresy: null,
  },
  {
    id: 3,
    statement:
      "God eternally exists as three distinct persons — Father, Son, and Holy Spirit — who share one divine essence equally and fully.",
    isTruth: true,
    correctHeresy: null,
  },
  {
    id: 4,
    statement:
      "Jesus Christ physically rose from the dead in a glorified but genuinely bodily resurrection on the third day.",
    isTruth: true,
    correctHeresy: null,
  },
  {
    id: 5,
    statement:
      "The Son is eternally begotten of the Father, not made or created — he is of the same divine substance as the Father.",
    isTruth: true,
    correctHeresy: null,
  },
  {
    id: 6,
    statement:
      "The Holy Spirit is a distinct divine person who proceeds from the Father, and is co-worshipped and co-glorified with the Father and the Son.",
    isTruth: true,
    correctHeresy: null,
  },
  {
    id: 7,
    statement:
      "At the incarnation, the eternal Son of God took on genuine human flesh and a full human nature, while remaining fully and completely divine.",
    isTruth: true,
    correctHeresy: null,
  },

  // ── Arianism (2) ─────────────────────────────────────────────────────────
  // Jesus is a glorious, created being — not co-eternal or co-equal with the Father.

  {
    id: 8,
    statement:
      "The Son of God was the first and greatest of all God's creations — exalted above all others, yet still a creature with a beginning in time.",
    isTruth: false,
    correctHeresy: "Arianism",
  },
  {
    id: 9,
    statement:
      "There was a time when the Son was not. Before the Father created him, the Son did not exist — making him ultimately subordinate to and lesser than the Father.",
    isTruth: false,
    correctHeresy: "Arianism",
  },

  // ── Pelagianism (2) ──────────────────────────────────────────────────────
  // Humans have the natural ability to choose good and earn salvation without grace.

  {
    id: 10,
    statement:
      "Human beings are born morally neutral and possess the natural ability to choose good and obey God's commands without any need for divine grace.",
    isTruth: false,
    correctHeresy: "Pelagianism",
  },
  {
    id: 11,
    statement:
      "Original sin affected Adam alone. His descendants sin by choosing to imitate his bad example, not because of any inherited corruption or fallen nature.",
    isTruth: false,
    correctHeresy: "Pelagianism",
  },

  // ── Gnosticism (2) ───────────────────────────────────────────────────────
  // Matter is evil; a lesser god made the world; secret knowledge saves.

  {
    id: 12,
    statement:
      "The physical world was crafted by an ignorant, lesser deity called the Demiurge. True salvation means escaping matter through secret spiritual knowledge revealed only to the enlightened.",
    isTruth: false,
    correctHeresy: "Gnosticism",
  },
  {
    id: 13,
    statement:
      "The body is a prison for the divine spark within. Those who receive hidden gnosis — sacred knowledge unknown to the masses — can transcend material existence and return to the true God.",
    isTruth: false,
    correctHeresy: "Gnosticism",
  },

  // ── Modalism (2) ─────────────────────────────────────────────────────────
  // Father, Son, and Spirit are not distinct persons but masks/modes of one God.

  {
    id: 14,
    statement:
      "The Father, Son, and Holy Spirit are not truly distinct persons, but three different modes or 'masks' that the one God wears at different times — like one actor playing three roles.",
    isTruth: false,
    correctHeresy: "Modalism",
  },
  {
    id: 15,
    statement:
      "God is a single divine person who expresses himself as Father in creation, as Son in redemption, and as Spirit in sanctification — three roles, but ultimately one undivided self.",
    isTruth: false,
    correctHeresy: "Modalism",
  },

  // ── Docetism (2) ─────────────────────────────────────────────────────────
  // Jesus only seemed or appeared to be human; his physical body was an illusion.

  {
    id: 16,
    statement:
      "Jesus only appeared to have a physical body. Being purely divine, he could not truly take on corruptible flesh — his humanity was a convincing illusion, like a divine hologram.",
    isTruth: false,
    correctHeresy: "Docetism",
  },
  {
    id: 17,
    statement:
      "The divine Christ could not truly suffer or die on the cross. What onlookers witnessed was an appearance of suffering — the eternal God remained completely untouched by physical pain or death.",
    isTruth: false,
    correctHeresy: "Docetism",
  },

  // ── Nestorianism (2) ─────────────────────────────────────────────────────
  // Christ is two separate persons (one human, one divine) loosely joined together.

  {
    id: 18,
    statement:
      "Mary should be called 'Mother of Christ,' not 'Mother of God,' because she only gave birth to the human person Jesus — not to the divine Son of God himself.",
    isTruth: false,
    correctHeresy: "Nestorianism",
  },
  {
    id: 19,
    statement:
      "In Jesus, there are two complete and distinct persons — one divine and one human — dwelling together in perfect moral harmony, like a divine person inhabiting and directing a human person.",
    isTruth: false,
    correctHeresy: "Nestorianism",
  },

  // ── Marcionism (2) ───────────────────────────────────────────────────────
  // The OT God and NT God are completely different deities; OT should be rejected.

  {
    id: 20,
    statement:
      "The harsh, vengeful God of the Old Testament is an entirely different deity from the loving Father that Jesus revealed. Jesus came to liberate humanity from the old God's law and wrath.",
    isTruth: false,
    correctHeresy: "Marcionism",
  },
  {
    id: 21,
    statement:
      "The Old Testament scriptures belong to an inferior religion entirely. The true God had nothing to do with the Jewish people — Jesus brought a completely fresh message from a higher, previously unknown God.",
    isTruth: false,
    correctHeresy: "Marcionism",
  },
];
