import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import DigitalCard from '@/components/DigitalCard';
import DocumentsSection from '@/components/DocumentsSection';

interface MainPageProps {
  userData: {
    phone: string;
    firstName: string;
    lastName: string;
  };
  onLogout: () => void;
}

export default function MainPage({ userData, onLogout }: MainPageProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'documents'>('card');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={32} />
            <div>
              <h1 className="text-xl font-bold">Единая карта россиянина</h1>
              <p className="text-sm text-blue-200">Цифровая система идентификации</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="text-white hover:bg-blue-800"
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выход
          </Button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('card')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'card'
                  ? 'text-blue-900 border-b-2 border-blue-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon name="CreditCard" size={20} className="inline mr-2" />
              Моя карта
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'text-blue-900 border-b-2 border-blue-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon name="FileText" size={20} className="inline mr-2" />
              Документы
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'card' && <DigitalCard userData={userData} />}
        {activeTab === 'documents' && <DocumentsSection />}
      </main>
    </div>
  );
}
