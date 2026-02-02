export type Translation = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    services: string;
    pricing: string;
    studentWork: string;
    faq: string;
  };
  pages: {
    home: { title: string; lead: string };
    services: { title: string; lead: string };
    pricing: { title: string; lead: string };
    tech: { title: string; lead: string };
    order: { title: string; lead: string };
    studentWork: { title: string; lead: string };
    faq: { title: string; lead: string };
    privacy: { title: string; lead: string };
    terms: { title: string; lead: string };
    cookies: { title: string; lead: string };
    python: { title: string; lead: string };
    csharp: { title: string; lead: string };
    notFound: { title: string; lead: string; back: string };
  };
  studentWorkPage: {
    introTitle: string;
    introText: string;
    videos: {
      name: string;
      subtitle: string;
      description: string;
      videoId: string;
    }[];
  };
  faqPage: {
    introTitle: string;
    introText: string;
    items: {
      question: string;
      answer: string[];
    }[];
  };
  privacyPage: {
    title: string;
    intro: string;
    companyTitle: string;
    controllerLinkLabel: string;
    cookiesLinkLabel: string;
    company: {
      name: string;
      details: string[];
    };
    sections: {
      heading: string;
      paragraphs: string[];
      list?: string[];
    }[];
    effectiveDate: string;
    contact: {
      title: string;
      prompt: string;
      placeholder: string;
      error: string;
      revealCta: string;
      copy: string;
      copied: string;
    };
  };
  cookiesPage: {
    title: string;
    intro: string;
    preferencesCta: string;
    companyTitle: string;
    company: {
      name: string;
      details: string[];
    };
    sections: {
      heading: string;
      paragraphs: string[];
      list?: string[];
    }[];
    effectiveDate: string;
    contact: {
      title: string;
      prompt: string;
      placeholder: string;
      error: string;
      revealCta: string;
      copy: string;
      copied: string;
    };
  };
  home: {
    heading: string;
    bullets: string[];
    cta: string;
    cards: { title: string; description: string }[];
    spotlight: {
      title: string;
      lead: string;
      communityTitle: string;
      communityText: string;
      reasonsTitle: string;
      reasons: string[];
      imageAlt: string;
    };
  };
  servicesPage: {
    title: string;
    lead: string;
    mentorTitle: string;
    mentorText: string;
    highlightsTitle: string;
    highlights: string[];
    tracksTitle: string;
    tracks: {
      title: string;
      subtitle: string;
      bullets: string[];
      imageAlt: string;
    }[];
    moreInfo: string;
    quote: {
      text: string;
      author: string;
      role: string;
    };
  };
  pricingPage: {
    introTitle: string;
    introText: string;
    ruleTitle: string;
    ruleText: string;
    packagesTitle: string;
    packages: {
      name: string;
      price: string;
      priceNote: string;
      description: string;
      bullets: string[];
      note: string;
      cta: string;
      imageAlt: string;
    }[];
    roiTitle: string;
    roiText: string;
    roiNote: string;
    consultCta: string;
    techCta: string;
  };
  techPage: {
    title: string;
    lead: string;
    sections: { title: string; items: string[] }[];
    note: string;
  };
  contactPage: {
    title: string;
    lead: string;
    consultationLabel: string;
    packageLabel: string;
    packageFallback: string;
    notice: string;
    processTitle: string;
    processSteps: string[];
    contact: {
      prompt: string;
      placeholder: string;
      error: string;
      revealCta: string;
      copy: string;
      copied: string;
    };
  };
  orderPage: {
    intro: string;
    processTitle: string;
    processSteps: string[];
    consultProcessTitle: string;
    consultProcessSteps: string[];
    packageLabel: string;
    packageHint: string;
    hoursLabel: string;
    hoursHint: string;
    savingsText: string;
    consultTitle: string;
    consultDuration: string;
    consultPackageValue: string;
    firstNameLabel: string;
    lastNameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitOrder: string;
    submitConsultation: string;
    consentText: string;
    privacyLinkLabel: string;
    termsLinkLabel: string;
    honeypotLabel: string;
    errors: {
      hoursRequired: string;
      recaptcha: string;
      spam: string;
      consentRequired: string;
      requiredFields: string;
      submitFailed: string;
    };
    successMessage: string;
  };
  pythonPage: {
    title: string;
    lead: string;
    sections: { title: string; items: string[] }[];
    timelineTitle: string;
    timelineNote: string;
    timeline: { title: string; duration: string; items: string[] }[];
    projectsTitle: string;
    projects: { name: string; note: string }[];
    projectsVideoTitle: string;
    projectsVideoNote: string;
  };
  csharpPage: {
    title: string;
    lead: string;
    sections: { title: string; items: string[] }[];
    timelineTitle: string;
    timelineNote: string;
    timeline: { title: string; duration: string; items: string[] }[];
    projectsTitle: string;
    projects: { name: string; note: string }[];
    projectsVideoTitle: string;
    projectsVideoNote: string;
  };
  termsPage: {
    title: string;
    intro: string;
    companyTitle: string;
    company: {
      name: string;
      details: string[];
    };
    sections: { heading: string; paragraphs: string[]; list?: string[] }[];
    contact: {
      title: string;
      prompt: string;
      placeholder: string;
      error: string;
      revealCta: string;
      copy: string;
      copied: string;
    };
    effectiveDate: string;
  };
  footer: {
    privacy: string;
    terms: string;
    cookies: string;
  };
  cookieBanner: {
    message: string;
    policyLinkLabel: string;
    acceptAll: string;
    rejectOptional: string;
    preferences: string;
    preferencesTitle: string;
    preferencesDescription: string;
    essentialLabel: string;
    essentialDescription: string;
    analyticsLabel: string;
    analyticsDescription: string;
    marketingLabel: string;
    marketingDescription: string;
    savePreferences: string;
  };
  newsletter: {
    title: string;
    description: string;
    emailPlaceholder: string;
    submitLabel: string;
    consentText: string;
    privacyLinkLabel: string;
  };
};
