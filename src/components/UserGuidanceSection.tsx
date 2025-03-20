
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, User, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserGuidanceSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Extract user email for greeting
  const userEmail = user?.email || '';
  const userName = userEmail.split('@')[0];
  
  // Define the guidance items with fallback text in case translations aren't working
  const guidanceItems = [
    {
      title: language === 'fi' ? 'Blogi' : 'Blog',
      description: language === 'fi' ? 'Tutustu uusimpiin vinkkeihin ja oppaisiin' : 'Explore our latest tips and guides for financial freedom',
      icon: BookOpen,
      action: () => navigate('/blog'),
    },
    {
      title: language === 'fi' ? 'Omat tiedot' : 'Profile',
      description: language === 'fi' ? 'Päivitä profiilisi ja seuraa edistymistäsi' : 'Update your profile and track your progress',
      icon: User,
      action: () => navigate('/dashboard'),
    },
    {
      title: language === 'fi' ? 'Oppaat' : 'Guides',
      description: language === 'fi' ? 'Lataa PDF-oppaita talouden hallintaan' : 'Download PDF guides for financial management',
      icon: FileText,
      action: () => navigate('/terms'),
    },
    {
      title: language === 'fi' ? 'Tuki' : 'Support',
      description: language === 'fi' ? 'Tarvitsetko apua? Ota yhteyttä tukeen' : 'Need help? Contact our support team',
      icon: Mail,
      action: () => window.location.href = 'mailto:tuki@velkavapaus.fi',
    },
  ];

  return (
    <div className="py-10 px-4 md:py-16">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'fi' ? 'Tervetuloa' : 'Welcome'}, {userName}!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'fi' 
              ? 'Näin käytät sivustoamme ja saat eniten irti palveluistamme.'
              : 'Here\'s how to use our site and get the most out of our services.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidanceItems.map((item, index) => (
            <Card 
              key={index} 
              className="transition-all hover:shadow-md cursor-pointer"
              onClick={item.action}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserGuidanceSection;
