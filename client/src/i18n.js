import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Civic AI Assistant'
      },
      nav: {
        services: 'Services',
        chat: 'Chat Assistant',
        changeLanguage: 'Change Language',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        register: 'Register'
      },
      home: {
        hero: {
          title: 'Your Civic Information Assistant',
          subtitle: 'Connecting communities with public services, resources, and opportunities through AI-powered assistance.',
          startChat: 'Start Chat Assistant',
          browseServices: 'Browse Services'
        },
        features: {
          title: 'How We Help Your Community',
          aiAssistant: {
            title: 'AI-Powered Assistant',
            description: 'Get instant help finding public services and information through our intelligent chat assistant.',
            action: 'Start Chatting'
          },
          serviceSearch: {
            title: 'Service Directory',
            description: 'Browse and search through comprehensive database of local public services and resources.',
            action: 'Browse Services'
          }
        },
        categories: {
          title: 'Service Categories'
        },
        accessibility: {
          title: 'Accessible for Everyone',
          description: 'Our platform supports multiple languages, screen readers, high contrast mode, and keyboard navigation to ensure everyone can access public services.'
        }
      },
      categories: {
        healthcare: 'Healthcare',
        education: 'Education',
        employment: 'Employment',
        housing: 'Housing',
        legal: 'Legal Aid',
        transportation: 'Transportation'
      }
    }
  },
  es: {
    translation: {
      app: {
        title: 'Asistente Cívico AI'
      },
      nav: {
        services: 'Servicios',
        chat: 'Asistente de Chat',
        changeLanguage: 'Cambiar Idioma',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
        login: 'Iniciar Sesión',
        register: 'Registrarse'
      },
      home: {
        hero: {
          title: 'Tu Asistente de Información Cívica',
          subtitle: 'Conectando comunidades con servicios públicos, recursos y oportunidades a través de asistencia impulsada por IA.',
          startChat: 'Iniciar Asistente de Chat',
          browseServices: 'Explorar Servicios'
        },
        features: {
          title: 'Cómo Ayudamos a Tu Comunidad',
          aiAssistant: {
            title: 'Asistente Impulsado por IA',
            description: 'Obtén ayuda instantánea para encontrar servicios públicos e información a través de nuestro asistente de chat inteligente.',
            action: 'Comenzar a Chatear'
          },
          serviceSearch: {
            title: 'Directorio de Servicios',
            description: 'Navega y busca en la base de datos integral de servicios públicos y recursos locales.',
            action: 'Explorar Servicios'
          }
        },
        categories: {
          title: 'Categorías de Servicios'
        },
        accessibility: {
          title: 'Accesible para Todos',
          description: 'Nuestra plataforma admite múltiples idiomas, lectores de pantalla, modo de alto contraste y navegación por teclado para garantizar que todos puedan acceder a los servicios públicos.'
        }
      },
      categories: {
        healthcare: 'Salud',
        education: 'Educación',
        employment: 'Empleo',
        housing: 'Vivienda',
        legal: 'Asistencia Legal',
        transportation: 'Transporte'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;