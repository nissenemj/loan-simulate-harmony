// Contact-related translations

export const contact = {
  en: {
    contact: {
      title: "Contact Us",
      description: "Have questions or feedback? We'd love to hear from you.",
      form: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        namePlaceholder: "Your name",
        emailPlaceholder: "your.email@example.com",
        subjectPlaceholder: "What is this regarding?",
        messagePlaceholder: "Your message here...",
        submit: "Send Message"
      },
      validation: {
        nameRequired: "Name is required",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email",
        subjectRequired: "Subject is required",
        messageRequired: "Message is required",
        messageMinLength: "Message must be at least 10 characters"
      },
      success: "Thank you for your message! We'll get back to you soon.",
      error: "There was an error sending your message. Please try again."
    }
  },
  fi: {
    contact: {
      title: "Ota yhteyttä",
      description: "Onko sinulla kysyttävää tai palautetta? Kuulemme mielellämme sinusta.",
      form: {
        name: "Nimi",
        email: "Sähköposti",
        subject: "Aihe",
        message: "Viesti",
        namePlaceholder: "Nimesi",
        emailPlaceholder: "sahkopostisi@esimerkki.com",
        subjectPlaceholder: "Mitä asiasi koskee?",
        messagePlaceholder: "Viestisi tähän...",
        submit: "Lähetä viesti"
      },
      validation: {
        nameRequired: "Nimi on pakollinen",
        emailRequired: "Sähköposti on pakollinen",
        emailInvalid: "Syötä kelvollinen sähköpostiosoite",
        subjectRequired: "Aihe on pakollinen",
        messageRequired: "Viesti on pakollinen",
        messageMinLength: "Viestin on oltava vähintään 10 merkkiä"
      },
      success: "Kiitos viestistäsi! Palaamme asiaan pian.",
      error: "Viestin lähettämisessä tapahtui virhe. Yritä uudelleen."
    }
  }
};

// Also export as default for backward compatibility
export default contact;
