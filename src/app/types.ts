
export type GirlUser = {
    id: number;
    email: string;
    password: string;
    role: 'girl'; 
    girlId: number;
    girl: Girl;
    welcomeMessage: string;
    welcomeSent: boolean;
    changePasswordMessage: string;
    changePasswordSent: boolean;
    edit?: Boolean;
  };
  
  export type AdminUser = {
    id: number;
    email: string;
    password: string;
    role: 'admin'; 
    girlId?: number;
    girl?: Girl;
  };
  
  export type PricingPlan = {
    id: number;
    name: string;
    price: number;
    discount: number;
    discountMessage: string;
  };
  
  export type Banner = {
    id: number;
    message: number;
    showBanner: boolean;
  };
  
  export type Girl = {
    id: number;
    name: string;
    bday: Date; 
    active: boolean; 
    hiden: boolean;
    bluredFace: boolean; 
    cityId?: number;
    specificLocation: {
      id: number;
      name: string;
    };
    phoneNumber: string;
    description: string; 
    sessionPrices: PricesObject;
    sessionPricesId?: number; 
    ethnicity: {
      id: number;
      name: string;
    };
    height: number; 
    weight: number; 
    barbie: boolean
    chestCm: number;
    waistCm: number;
    bottomCm: number;
    parking: boolean;
    schedule: ScheduleRow[]; 
    attributes: Attributes; 
    images: MultimediaObject; 
    videos: MultimediaObject;
    requestProfilePicture?: string;
    profilePicture: string; 
    editLevel: string; 
    nationality: {
      id: number;
      name: string;
    };
    categories: GirlCategory[]; 
    verificationId: number | null; 
    city: {
      id: number;
      name: string;
    }; 
    services: any[]; 
    paidServices: any[]; 
    paymentTier: PaymentTier;
    subscription: Subscription;
    verification: Verification;
  };
  
  export type Attributes = {
    contexture: Contexture;
    hair: HairColor;
    eyes: EyeColor;
    chestSize: ChestSize;
    bottomSize: BottomSize;
    shaving: ShavingStatus; 
    attentionAtHotels: boolean; 
    attentionAtGirlPlace: boolean; 
    attentionAtClientPlace: boolean; 
    smoking: boolean; 
    tatoos: boolean; 
    languages: string[]; 
  };
  
  export type PricesObject = {
    id?: number;
    halfHourPrice?: number;
    oneHourPrice: number;
    oneAndAHalfHourPrice?: number;
    twoHourPrice?: number;
    fourHourPrice?: number;
    dinnerPrice?: number;
    wholeNight?: number;
    girlId?: number;
    girl?: Girl;
  };
  
  export type MultimediaObject = {
    active: string[];
    request: string[];
    bluredFace: string[];
  };
  
  export type Subscription = {
    id?: number;
    girlId?: number;
    availablePauses: number;
    pauseStartDate: Date | undefined;
    pauseEndDate: Date | undefined;
    expiryDate: Date;
    deactivationDate: Date; 
  };
  
  export type SubscriptionPayment = {
    id?: number;
    paymentTier: PaymentTier;
    amountPaid: number;
    paymentDate: Date;
    duration: SubscriptionDuration;
    paymentMethod: string;
  };
  
  export enum SubscriptionDuration {
    MONTH = 'month',
    TWO_WEEKS = '2weeks',
    ONE_WEEK = '1week',
  }
  
  export enum EyeColor {
    BLACK = 'Ojos Negros',
    BROWN_LIGHT = 'Ojos castaño claros',
    BROWN_DARK = 'Ojos castaño oscuro',
    BLUE = 'Ojos azules',
    GREEN = 'Ojos verdes',
  }
  
  export enum Contexture {
    THIN = 'Contextura delgada',
    MEDIUM = 'Contextura media',
    BIG = 'Contextura gruesa',
  }
  
  export enum BottomSize {
    SMALL = 'Trasero pequeño',
    MEDIUM = 'Trasero medio',
    BIG = 'Trasero grande',
  }
  
  export enum ChestSize {
    SMALL = 'Senos pequeños',
    MEDIUM = 'Senos medianos',
    BIG = 'Senos grandes',
  }
  
  export enum HairColor {
    BLACK = 'Cabello negro',
    BROWN_LIGHT = 'Cabello castaño claro',
    BROWN_DARK = 'Cabello castaño oscuro',
    BLONDE = 'Cabello rubio',
    GINGER = 'Cabello peli rojo',
  }
  
  export enum ShavingStatus {
    FULL = 'Depilación completa',
    TRIMED = 'Depilación de rebaje',
    NONE = 'Sin Depilar',
  }
  
  export enum EditLevel {
    NONE = 'Nulo',
    MID = 'Leve',
    FULL = 'Editado',
  }
  
  export type AtentionPlaces = {
    delivery: boolean;
    hotels: boolean;
    ownPlace: boolean;
  };
  
  export type Verification = {
    id: number; 
    carnetFrontal: string;
    carnetAtras: string;
    status: VerificationStatus; 
    name: string; 
    lastname: string; 
    bday: string; 
    rut: string | null; 
    verificationDate: string | null; 
    verifiedBy: number | null; 
    girlId: number; 
  };
  
  export type AppNotification = {
    id: number;
    type: string;
    fromUserId: number;
    date: Date;
    searchId: number;
  };
  
  export type AnounceRequest = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    paymentTier: string;
    message: string;
  };
  
  export type Service = {
    id?: number;
    name: string;
    description: string;
    edit?: boolean;
    new?: boolean;
  };
  
  export type City = {
    id?: number;
    name: string;
    edit?: boolean;
    new?: boolean;
  };
  
  export type SpecificLocation = {
    id?: number;
    name: string;
    edit?: boolean;
    new?: boolean;
  };
  
  export type Ethnicity = {
    id?: number;
    name: string;
    edit?: boolean;
    new?: boolean;
  };
  
  export type Nationality = {
    id?: number;
    name: string;
    edit?: boolean;
    new?: boolean;
  };
  
  export enum SessionDuration {
    THIRTY_MINUTES = '30 Minutos',
    ONE_HOUR = '1 Hora',
    HOUR_AND_HALF = '1 Hora y media',
    TWO_HOURS = '2 Horas',
    FOUR_HOURS = '4 Horas',
    NIGHT = 'Noche Completa',
    DINNER = 'Cena',
  }
  
  export type TimeBracket = {
    startTime: string;
    endTime: string;
  };
  
  export type ScheduleRow = {
    monday: TimeBracket | undefined;
    tuesday: TimeBracket | undefined;
    wednesday: TimeBracket | undefined;
    thursday: TimeBracket | undefined;
    friday: TimeBracket | undefined;
    saturday: TimeBracket | undefined;
    sunday: TimeBracket | undefined;
  };
  
  export enum GirlCategory {
    GOLD = 'Gold',
    SILVER = 'Silver',
    BRONZE = 'Bronze',
    MADURAS = 'Maduras',
    MASAJISTAS = 'Masajistas',
    BARBIE = 'Barbie',
  }
  
  export enum PaymentTier {
    SPECIAL = 'Especial',
    PREMIUM = 'Premium',
    REGULAR = 'Regular',
    ECONOMIC = 'Economica',
  }
  
  export enum VerificationStatus {
    PENDING = 'Pending',
    SCHEDULED = 'Scheduled',
    PROCESSING = 'Processing',
    VERIFIED = 'Verified',
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    GIRL = 'girl',
  }
  
  export type AllDaysTimeOptions = {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  
  export type ClientReview = {
    id?: number;
    girlId?: number;
    review: string;
    rating: number;
    date?: string | Date;
    phoneNumber: string;
  };
  