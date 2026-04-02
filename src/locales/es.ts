const heresy = (name: string, tagline: string, council: string) => ({
  name,
  tagline,
  council,
});

export default {
  meta: {
    appTitle: "¿Verdad o herejía?",
  },
  home: {
    eyebrow: "El cuestionario teológico",
    titleLine1: "¿Verdad o",
    titleLine2: "herejía?",
    taglineLine1: "Distingue la doctrina sana",
    taglineLine2: "de los errores antiguos",
    startQuiz: "Comenzar",
    footerHint:
      "¿Podrás distinguir los concilios antiguos del caos antiguo?",
    statsLine: "21 afirmaciones · 7 herejías clásicas",
    languageLabel: "Idioma",
  },
  screens: {
    quiz: { title: "¿Verdad o herejía?" },
    heresySelector: { title: "¡Nombra esa herejía!" },
    explanation: { title: "El veredicto" },
    settings: { title: "Ajustes" },
  },
  quiz: {
    truth: "Verdad",
    truthSub: "Es doctrina ortodoxa",
    heresy: "¡Herejía!",
    heresySub: "Contradice la fe",
  },
  heresySelector: {
    headline: "¡Nombra esa herejía!",
    sub: "¿Qué herejía concreta se esconde en esta afirmación?",
  },
  scoreHeader: {
    score: "Puntos",
    accuracy: "Precisión",
    streak: "Racha",
  },
  questionCard: {
    question: "Pregunta {{n}}",
    hint: "¿Verdad o herejía?",
  },
  explanation: {
    correct: "✨ ¡Correcto!",
    wrong: "⚔️ ¡Herejía detectada!",
    orthodoxLine:
      "Esta afirmación es doctrina ortodoxa sólida: ¡Verdad!",
    heresyLine: "Esto es la herejía de {{heresy}}.",
    wrongGuess:
      "Elegiste {{guess}} — cerca, pero la respuesta era {{correct}}.",
    statementLabel: "La afirmación",
    councilWeighs: "El dictamen del concilio",
    consulting: "Consultando a los concilios antiguos…",
    explanationUnavailable: "Explicación no disponible",
    goToSettings: "Ir a Ajustes",
    nextQuestion: "Siguiente pregunta",
    score: "Puntos",
    streak: "Racha",
    accuracy: "Precisión",
    noApiKey:
      "No hay clave API. Toca abajo para añadir tu clave de Anthropic en Ajustes.",
    genericError: "Algo salió mal.",
  },
  summary: {
    gameOver: "Fin de la partida",
    correct: "Aciertos",
    attempted: "Intentos",
    accuracy: "Precisión",
    bestStreak: "Mejor racha",
    playAgain: "Jugar de nuevo",
    backHome: "Volver al inicio",
    grades: {
      S: {
        label: "¡Digno de concilio!",
        message:
          "Los concilios antiguos te habrían tomado como delegado. Nicea no estaría completa sin ti.",
      },
      A: {
        label: "¡Teólogo sólido!",
        message:
          "Agustín asentiría con la cabeza. Unas páginas más de Atanasio y serás imparable.",
      },
      B: {
        label: "¡Alumno prometedor!",
        message:
          "Te mueves bien entre credos, pero un par de herejías se colaron.",
      },
      C: {
        label: "¡Sigue estudiando!",
        message:
          "Las herejías van ganando. Son astutas, antiguas y hoy un poco mejores que tú.",
      },
      F: {
        label: "Sospechoso de herejía…",
        message:
          "Alarmante. El mismo Arrio no lo habría hecho peor. Lee el Credo de Nicea antes del próximo intento.",
      },
    },
  },
  settings: {
    apiKeyTitle: "Clave API de Anthropic",
    keyStored: "✓ Clave guardada",
    description:
      "Esta app usa Claude para generar explicaciones tras cada respuesta. Consigue tu clave en {{link}} — solo tarda unos segundos.",
    linkLabel: "console.anthropic.com",
    placeholder: "sk-ant-api03-...",
    saveKey: "Guardar clave",
    saved: "¡Guardado!",
    about: "Acerca de",
    aboutBody:
      "¿Verdad o herejía? pone a prueba tu conocimiento de la doctrina cristiana y las 7 herejías clásicas condenadas por los primeros concilios — de Nicea a Éfeso. Cada explicación se genera al momento con Claude, así que no hay dos partidas iguales.",
    poweredBy: "Con claude-3-5-sonnet-20241022",
    privacy:
      "Tu clave API solo se guarda en este dispositivo con almacenamiento local cifrado. No se envía a ningún sitio salvo directamente a la API de Anthropic.",
    alertMissingTitle: "Falta la clave",
    alertMissingBody: "Pega primero tu clave API de Anthropic.",
    alertInvalidTitle: "Clave no válida",
    alertInvalidBody:
      'Las claves API de Anthropic empiezan por "sk-". Revísala.',
  },
  heresies: {
    Arianism: heresy(
      "Arrianismo",
      "Jesús es una criatura creada y menor",
      "Condenado en Nicea (325 d.C.)"
    ),
    Pelagianism: heresy(
      "Pelagianismo",
      "El ser humano puede ganarse la salvación por esfuerzo",
      "Condenado en Cartago (418 d.C.)"
    ),
    Gnosticism: heresy(
      "Gnosticismo",
      "El conocimiento secreto salva; la materia es mala",
      "Combatido por los padres antiguos, siglos II–III"
    ),
    Modalism: heresy(
      "Modalismo",
      "Dios lleva tres máscaras, no personas distintas",
      "Rechazado por la iglesia del siglo III"
    ),
    Docetism: heresy(
      "Doceismo",
      "Jesús solo parecía ser humano",
      "Combatido por Ignacio, c. 107 d.C."
    ),
    Nestorianism: heresy(
      "Nestorianismo",
      "Cristo son dos personas separadas",
      "Condenado en Éfeso (431 d.C.)"
    ),
    Marcionism: heresy(
      "Marcionismo",
      "Dios AT ≠ Dios NT; descarta el AT",
      "Marción excomulgado, 144 d.C."
    ),
  },
  questions: {
    "1": {
      statement:
        "Jesucristo posee dos naturalezas completas — plenamente divina y plenamente humana — unidas en una sola persona sin confusión, mezcla ni separación.",
    },
    "2": {
      statement:
        "La salvación es enteramente por gracia mediante la fe — un don de Dios, no ganada por esfuerzo humano, logro moral ni libre albedrío solo.",
    },
    "3": {
      statement:
        "Dios existe eternamente como tres personas distintas — Padre, Hijo y Espíritu Santo — que comparten una sola esencia divina por igual y plenamente.",
    },
    "4": {
      statement:
        "Jesucristo resucitó físicamente de entre los muertos en una resurrección glorificada pero verdaderamente corporal al tercer día.",
    },
    "5": {
      statement:
        "El Hijo es engendrado eternamente del Padre, no hecho ni creado — es de la misma sustancia divina que el Padre.",
    },
    "6": {
      statement:
        "El Espíritu Santo es una persona divina distinta que procede del Padre, y es coadorado y coglorificado con el Padre y el Hijo.",
    },
    "7": {
      statement:
        "En la encarnación, el Hijo eterno de Dios asumió carne humana genuina y una naturaleza humana completa, permaneciendo plenamente y totalmente divino.",
    },
    "8": {
      statement:
        "El Hijo de Dios fue la primera y mayor de todas las creaciones de Dios — exaltado sobre todas las demás, pero aún una criatura con un comienzo en el tiempo.",
    },
    "9": {
      statement:
        "Hubo un tiempo en que el Hijo no era. Antes de que el Padre lo creara, el Hijo no existía — haciéndolo en última instancia subordinado y menor que el Padre.",
    },
    "10": {
      statement:
        "Los seres humanos nacen moralmente neutros y poseen la capacidad natural de elegir el bien y obedecer los mandamientos de Dios sin necesidad de gracia divina.",
    },
    "11": {
      statement:
        "El pecado original afectó solo a Adán. Sus descendientes pecan por imitar su mal ejemplo, no por culpa de una corrupción heredada o naturaleza caída.",
    },
    "12": {
      statement:
        "El mundo físico fue hecho por una deidad ignorante y menor llamada Demiurgo. La verdadera salvación significa escapar de la materia mediante conocimiento espiritual secreto revelado solo a los iluminados.",
    },
    "13": {
      statement:
        "El cuerpo es una prisión para la chispa divina interior. Quienes reciben la gnosis oculta — conocimiento sagrado desconocido para las masas — pueden trascender la existencia material y volver al verdadero Dios.",
    },
    "14": {
      statement:
        "El Padre, el Hijo y el Espíritu Santo no son personas verdaderamente distintas, sino tres modos o 'máscaras' distintas que el único Dios usa en distintos momentos — como un actor en tres papeles.",
    },
    "15": {
      statement:
        "Dios es una sola persona divina que se expresa como Padre en la creación, como Hijo en la redención y como Espíritu en la santificación — tres roles, pero en última instancia un solo yo indiviso.",
    },
    "16": {
      statement:
        "Jesús solo parecía tener un cuerpo físico. Siendo puramente divino, no podía asumir verdaderamente carne corruptible — su humanidad era una ilusión convincente, como un holograma divino.",
    },
    "17": {
      statement:
        "El Cristo divino no podía sufrir ni morir verdaderamente en la cruz. Lo que vieron los espectadores fue una apariencia de sufrimiento — el Dios eterno permaneció totalmente intacto ante el dolor físico o la muerte.",
    },
    "18": {
      statement:
        "María debe llamarse 'Madre de Cristo', no 'Madre de Dios', porque solo dio a luz a la persona humana Jesús — no al Hijo divino de Dios en sí.",
    },
    "19": {
      statement:
        "En Jesús hay dos personas completas y distintas — una divina y una humana — que moran juntas en armonía moral perfecta, como una persona divina habitando y dirigiendo una persona humana.",
    },
    "20": {
      statement:
        "El Dios duro y vengativo del Antiguo Testamento es una deidad enteramente distinta del Padre amoroso que reveló Jesús. Jesús vino a liberar a la humanidad de la ley y la ira del Dios antiguo.",
    },
    "21": {
      statement:
        "Las Escrituras del Antiguo Testamento pertenecen a una religión inferior por completo. El verdadero Dios no tuvo nada que ver con el pueblo judío — Jesús trajo un mensaje totalmente nuevo de un Dios superior y antes desconocido.",
    },
  },
};
