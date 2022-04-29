export interface MTGACard {
    allParts?: AllPart[] // Cartas con tokens y cosas así
    artist: string
    artistIDS: string[]
    booster: boolean
    cardBackID?: string // Parte de atrás normal: 0aeebaf5-8c7d-4636-9e82-8c27447861f7, si no undefined
    cardFaces?: CardFace[] // O undefined, o 2 caras, da igual que sea 2 en la misma (aftermath), o cartas que se transformen, o cartas dobles
    cmc: number
    collectorNumber: string
    colorIdentity: Color[]
    colors?: Color[]
    digital: boolean
    finishes: Finish[]
    flavorText?: string
    foil: boolean
    id: string
    imageUris?: ImageUris
    keywords: Keywords[]
    lang: Lang
    layout: Layout
    legalities: Legalities
    loyalty?: string
    manaCost?: string
    multiverseIDS: number[]
    name: string
    oracleText?: string
    power?: string
    producedMana?: Color[]
    rarity: Rarity
    releasedAt: Date
    rulingsURI: string
    scryfallURI: string
    set: Set
    setName: SetName
    setType: SetType
    setURI: string // FIXME: Check, puede ser interesante para hacer paginas de sets
    toughness?: string
    typeLine: string
}

export interface AllPart {
    component: Component
    id: string
    name: string
    object: AllPartObject
    typeLine: string
    uri: string
}

export enum Component {
    ComboPiece = 'combo_piece',
    Token = 'token',
}

export enum AllPartObject {
    RelatedCard = 'related_card',
}

export interface CardFace {
    artist: string
    artistID: string
    colorIndicator?: Color[]
    colors?: Color[]
    flavorName?: string
    flavorText?: string
    illustrationID?: string
    imageUris?: ImageUris
    loyalty?: string
    manaCost: string
    name: string
    object: CardFaceObject
    oracleText: string
    power?: string
    toughness?: string
    typeLine: string
}

export enum Color {
    W = 'W',
    U = 'U',
    B = 'B',
    R = 'R',
    G = 'G',
    C = 'C',
}

export interface ImageUris {
    artCrop: string
    borderCrop: string
    large: string
    normal: string
    png: string
    small: string
}

export enum CardFaceObject {
    CardFace = 'card_face',
}

export enum Finish {
    Etched = 'etched',
    Foil = 'foil',
    Nonfoil = 'nonfoil',
}

export enum Lang {
    En = 'en',
}

export enum Layout {
    Adventure = 'adventure',
    Class = 'class',
    ModalDfc = 'modal_dfc',
    Normal = 'normal',
    Saga = 'saga',
    Split = 'split',
    Transform = 'transform',
}

export interface Legalities {
    alchemy: Alchemy
    brawl: Alchemy
    commander: Alchemy
    duel: Alchemy
    future: Alchemy
    gladiator: Alchemy
    historic: Alchemy
    historicbrawl: Alchemy
    legacy: Alchemy
    modern: Alchemy
    oldschool: Alchemy
    pauper: Alchemy
    paupercommander: Alchemy
    penny: Alchemy
    pioneer: Alchemy
    premodern: Alchemy
    standard: Alchemy
    vintage: Alchemy
}

export enum Alchemy {
    Banned = 'banned',
    Legal = 'legal',
    NotLegal = 'not_legal',
    Restricted = 'restricted',
}

export enum Rarity {
    Common = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    Mythic = 'mythic',
}

export enum Set {
    Afr = 'afr',
    Ajmp = 'ajmp',
    Akr = 'akr',
    Anb = 'anb',
    DOM = 'dom',
    Eld = 'eld',
    G18 = 'g18',
    Grn = 'grn',
    Ha1 = 'ha1',
    Ha2 = 'ha2',
    Ha3 = 'ha3',
    Ha4 = 'ha4',
    Ha5 = 'ha5',
    Iko = 'iko',
    J21 = 'j21',
    Jmp = 'jmp',
    Khm = 'khm',
    Klr = 'klr',
    M19 = 'm19',
    M20 = 'm20',
    M21 = 'm21',
    Mid = 'mid',
    Neo = 'neo',
    Oana = 'oana',
    Pana = 'pana',
    Rix = 'rix',
    Rna = 'rna',
    Snc = 'snc',
    Sta = 'sta',
    Stx = 'stx',
    Thb = 'thb',
    Vow = 'vow',
    War = 'war',
    Xln = 'xln',
    Ymid = 'ymid',
    Yneo = 'yneo',
    Znr = 'znr',
}

export enum SetName {
    AdventuresInTheForgottenRealms = 'Adventures in the Forgotten Realms',
    AlchemyInnistrad = 'Alchemy: Innistrad',
    AlchemyKamigawa = 'Alchemy: Kamigawa',
    AmonkhetRemastered = 'Amonkhet Remastered',
    ArenaBeginnerSet = 'Arena Beginner Set',
    ArenaNewPlayerExperienceCards = 'Arena New Player Experience Cards',
    CoreSet2019 = 'Core Set 2019',
    CoreSet2020 = 'Core Set 2020',
    CoreSet2021 = 'Core Set 2021',
    Dominaria = 'Dominaria',
    GuildsOfRavnica = 'Guilds of Ravnica',
    HistoricAnthology1 = 'Historic Anthology 1',
    HistoricAnthology2 = 'Historic Anthology 2',
    HistoricAnthology3 = 'Historic Anthology 3',
    HistoricAnthology4 = 'Historic Anthology 4',
    HistoricAnthology5 = 'Historic Anthology 5',
    IkoriaLairOfBehemoths = 'Ikoria: Lair of Behemoths',
    InnistradCrimsonVow = 'Innistrad: Crimson Vow',
    InnistradMidnightHunt = 'Innistrad: Midnight Hunt',
    Ixalan = 'Ixalan',
    Jumpstart = 'Jumpstart',
    JumpstartArenaExclusives = 'Jumpstart Arena Exclusives',
    JumpstartHistoricHorizons = 'Jumpstart: Historic Horizons',
    KaladeshRemastered = 'Kaladesh Remastered',
    Kaldheim = 'Kaldheim',
    KamigawaNeonDynasty = 'Kamigawa: Neon Dynasty',
    M19GiftPack = 'M19 Gift Pack',
    MTGArenaPromos = 'MTG Arena Promos',
    RavnicaAllegiance = 'Ravnica Allegiance',
    RivalsOfIxalan = 'Rivals of Ixalan',
    StreetsOfNewCapenna = 'Streets of New Capenna',
    StrixhavenMysticalArchive = 'Strixhaven Mystical Archive',
    StrixhavenSchoolOfMages = 'Strixhaven: School of Mages',
    TherosBeyondDeath = 'Theros Beyond Death',
    ThroneOfEldraine = 'Throne of Eldraine',
    WarOfTheSpark = 'War of the Spark',
    ZendikarRising = 'Zendikar Rising',
}

export enum SetType {
    Alchemy = 'alchemy',
    Box = 'box',
    Core = 'core',
    DraftInnovation = 'draft_innovation',
    Expansion = 'expansion',
    Masterpiece = 'masterpiece',
    Masters = 'masters',
    Promo = 'promo',
    Starter = 'starter',
}

export enum Keywords {
    ADAMANT = 'Adamant',
    ADAPT = 'Adapt',
    ADDENDUM = 'Addendum',
    AFFINITY = 'Affinity',
    AFFLICT = 'AFFLICT',
    AFTERLIFE = 'Afterlife',
    AFTERMATH = 'Aftermath',
    AMASS = 'Amass',
    BATTALION = 'Battalion',
    BOAST = 'Boast',
    CASCADE = 'Cascade',
    CHANGELING = 'Changeling',
    CHANNEL = 'Channel',
    CLEAVE = 'Cleave',
    COMPANION = 'Companion',
    CONJURE = 'Conjure',
    CONSTELLATION = 'Constellation',
    CONVOKE = 'Convoke',
    COVEN = 'Coven',
    CREW = 'Crew',
    CYCLING = 'Cycling',
    DAYBOUND = 'Daybound',
    DEATHTOUCH = 'Deathtouch',
    DEFENDER = 'Defender',
    DELIRIUM = 'Delirium',
    DISTURB = 'Disturb',
    DOMAIN = 'Domain',
    DOUBLE_STRIKE = 'Double strike',
    ECHO = 'Echo',
    EMBALM = 'Embalm',
    ENCHANT = 'Enchant', // TODO: REMOVE THIS KEYWORD, FROM CARDS AS WELL
    ENRAGE = 'Enrage',
    EQUIP = 'Equip',
    ESCAPE = 'Escape',
    ETERNALIZE = 'Eternalize',
    EVOKE = 'Evoke',
    EVOLVE = 'Evolve',
    EXERT = 'Exert',
    EXPLOIT = 'Exploit',
    EXPLORE = 'Explore',
    FABRICATE = 'Fabricate',
    FEAR = 'Fear',
    FIGHT = 'Fight',
    FIRST_STRIKE = 'First strike',
    FLASH = 'Flash',
    FLASHBACK = 'Flashback',
    FLYING = 'Flying',
    FORESTWALK = 'Forestwalk',
    FORETELL = 'Foretell',
    HASTE = 'Haste',
    HELLBENT = 'Hellbent',
    HEXPROOF = 'Hexproof',
    HEXPROOF_FROM = 'Hexproof from',
    IMPROVISE = 'Improvise',
    INDESTRUCTIBLE = 'Indestructible',
    INTENSITY = 'Intensity',
    INVESTIGATE = 'Investigate',
    JUMP_START = 'Jump-start',
    KICKER = 'Kicker',
    LANDFALL = 'Landfall',
    LANDWALK = 'Landwalk',
    LEARN = 'Learn',
    LIFELINK = 'Lifelink',
    LIVING_WEAPON = 'Living weapon',
    MADNESS = 'Madness',
    MAGECRAFT = 'Magecraft',
    MENACE = 'Menace',
    MENTOR = 'Mentor',
    MILL = 'Mill',
    MODULAR = 'Modular',
    MORBID = 'Morbid',
    MUTATE = 'Mutate',
    NIGHTBOUND = 'Nightbound',
    NINJUTSU = 'Ninjutsu',
    OUTLAST = 'Outlast',
    OVERLOAD = 'Overload',
    PACK_TACTICS = 'Pack tactics',
    PERSIST = 'Persist',
    PROLIFERATE = 'Proliferate',
    PROTECTION = 'Protection',
    PROWESS = 'Prowess',
    RAID = 'Raid',
    REACH = 'Reach',
    REBOUND = 'Rebound',
    RECONFIGURE = 'Reconfigure',
    REINFORCE = 'Reinforce',
    RETRACE = 'Retrace',
    REVOLT = 'Revolt',
    RIOT = 'Riot',
    SCAVENGE = 'Scavenge',
    SCRY = 'Scry',
    SEEK = 'Seek',
    SPECTACLE = 'Spectacle',
    SPLIT_SECOND = 'Split second',
    STORM = 'Storm',
    SUPPORT = 'Support',
    SURVEIL = 'Surveil',
    SWAMPWALK = 'Swampwalk',
    THRESHOLD = 'Threshold',
    TRAINING = 'Training',
    TRAMPLE = 'Tramble',
    TRANSFORM = 'Transform',
    UNDERGROWTH = 'Undergrowth',
    UNEARTH = 'Unearth',
    VIGILANCE = 'Vigilance',
    WARD = 'Ward',
}
