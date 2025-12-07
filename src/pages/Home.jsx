import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Stethoscope, Clock, Award, Phone, MapPin, Activity, Shield, Users, Calendar } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  const handleBookNow = () => {
    navigate("/book-appointment");
  };

  return (
    <div className="min-h-screen">
      {/* Language Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          className="bg-white/80 backdrop-blur-sm border-sky-200 hover:bg-sky-50 font-medium"
          data-testid="language-toggle-btn"
          aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-200"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-400"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-left">
              <div className="inline-block">
                <div className="glass px-6 py-3 rounded-full inline-flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-600" />
                  <span className="text-sky-700 font-semibold text-sm">{t('hero.badge')}</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('hero.title')}
                <span className="block text-sky-600 mt-2">{t('hero.subtitle')}</span>
              </h1>
              
              <p className="text-base text-gray-600 max-w-xl">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBookNow}
                  size="lg"
                  className="btn-primary text-base"
                  data-testid="hero-book-now-btn"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('hero.bookNow')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="btn-secondary text-base"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  data-testid="hero-contact-btn"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t('hero.contact')}
                </Button>
              </div>

              {/* Quick Contact */}
              <div className="glass-strong rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-sky-600" />
                  <a href="tel:+919279816626" className="text-gray-800 font-semibold hover:text-sky-600 transition-colors">
                    +91 9279816626
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-sky-600" />
                  <span className="text-gray-700">{t('hero.timing')}</span>
                </div>
              </div>
            </div>

            {/* Right Content - Doctor Image */}
            <div className="relative animate-fade-in-right delay-200">
              <div className="glass-strong rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://i.ibb.co/67FQMjXC/Untitled-design-1.png"
                  alt="Dr. Sandeep Kumar"
                  className="rounded-2xl w-full object-cover shadow-lg"
                  data-testid="doctor-image"
                />
                <div className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Award className="w-10 h-10 text-sky-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">15+</p>
                      <p className="text-sm text-gray-600">{t('hero.experience')}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 glass-strong rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Users className="w-10 h-10 text-sky-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">5000+</p>
                      <p className="text-sm text-gray-600">{t('hero.patients')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="about-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <div className="glass-strong rounded-3xl p-8 shadow-xl">
                <img
                  src="https://i.ibb.co/N2sFXv6p/Untitled-design.png"
                  alt="BL Uro-Stone & Kidney Clinic"
                  className="rounded-2xl w-full object-cover"
                  data-testid="clinic-image"
                />
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-right delay-200">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                {t('about.title')}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-base">
                  {t('about.intro')}
                </p>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">{t('about.credentials')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" />
                      <span>MBBS, MS (General Surgery)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" />
                      <span>FMAS, DNB Urology (Ahmedabad)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" />
                      <span>Fellowship Endourology (Rajkot)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" />
                      <span>Ex. Senior Resident AIIMS & PMCH Patna</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" />
                      <span>Reg. No.: BCMR - 42188</span>
                    </li>
                  </ul>
                </div>
                <p className="text-base">
                  {t('about.specialization')}
                </p>
              </div>

              <Button
                onClick={handleBookNow}
                size="lg"
                className="btn-primary"
                data-testid="about-book-btn"
              >
                {t('about.bookButton')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Activity,
                title: t('services.service1.title'),
                desc: t('services.service1.desc'),
                testId: 'service-kidney-stone',
                delayClass: ''
              },
              {
                icon: Stethoscope,
                title: t('services.service2.title'),
                desc: t('services.service2.desc'),
                testId: 'service-urology',
                delayClass: 'delay-200'
              },
              {
                icon: Shield,
                title: t('services.service3.title'),
                desc: t('services.service3.desc'),
                testId: 'service-endourology',
                delayClass: 'delay-400'
              },
              {
                icon: Award,
                title: t('services.service4.title'),
                desc: t('services.service4.desc'),
                testId: 'service-general',
                delayClass: 'delay-600'
              }
            ].map((service, index) => (
              <div
                key={service.testId}
                className={`service-card animate-fade-in-up ${service.delayClass}`}
                data-testid={service.testId}
              >
                <service.icon className="w-12 h-12 text-sky-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="contact-section">
        <div className="max-w-7xl mx-auto">
          <div className="glass-strong rounded-3xl p-12 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8 animate-fade-in-left">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                  {t('contact.title')}
                </h2>
                <p className="text-base text-gray-600">
                  {t('contact.subtitle')}
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-sky-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.addressTitle')}</h3>
                      <p className="text-sm text-gray-600" data-testid="clinic-address">
                        1st Floor, G Jeevan Drug Agency Building,<br />
                        Bihar Tokies Road ke Samne,<br />
                        Line Bazar, Purnea - 854301
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-sky-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.phoneTitle')}</h3>
                      <a href="tel:+919279816626" className="text-sm text-sky-600 hover:text-sky-700 font-medium" data-testid="clinic-phone">
                        +91 9279816626
                      </a>
                      <p className="text-xs text-gray-500 mt-1">{t('contact.whatsapp')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-sky-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.hoursTitle')}</h3>
                      <p className="text-sm text-gray-600" data-testid="clinic-hours">
                        {t('contact.hours')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center animate-fade-in-right delay-200">
                <div className="text-center space-y-6">
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <Calendar className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('contact.cta')}</h3>
                  <Button
                    onClick={handleBookNow}
                    size="lg"
                    className="btn-primary text-base"
                    data-testid="contact-book-btn"
                  >
                    {t('contact.bookButton')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-sky-200">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            BL Uro-Stone & Kidney Clinic
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Dr. Sandeep Kumar - {t('footer.specialist')}
          </p>
          <p className="text-xs text-gray-500">
            © 2025 BL Uro-Stone & Kidney Clinic. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
