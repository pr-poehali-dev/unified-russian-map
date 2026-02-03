import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';
import BankCardManager from '@/components/BankCardManager';
import type { UserData } from '@/App';

interface DigitalCardProps {
  userData: UserData;
}

export default function DigitalCard({ userData }: DigitalCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const issueDate = new Date().toLocaleDateString('ru-RU');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div 
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <div className="absolute w-full h-full backface-hidden">
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-700 rounded-2xl shadow-2xl p-8 h-full">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-blue-100 text-sm font-medium mb-2">
                    ЕДИНАЯ КАРТА РОССИЯНИНА
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-6 bg-white rounded"></div>
                    <div className="w-8 h-6 bg-blue-500 rounded"></div>
                    <div className="w-8 h-6 bg-red-600 rounded"></div>
                  </div>
                </div>
                <Icon name="Shield" size={48} className="text-white opacity-80" />
              </div>

              <div className="mb-6">
                <div className="text-blue-200 text-xs mb-1">ВЛАДЕЛЕЦ КАРТЫ</div>
                <div className="text-white text-xl font-semibold">
                  {userData.firstName} {userData.lastName}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <div className="text-blue-200 text-xs mb-1">ДАТА ВЫДАЧИ</div>
                  <div className="text-white text-sm font-medium">{issueDate}</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-2">
                  <div className="text-blue-900 font-bold text-lg">МИР</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="text-slate-300 text-sm">Нажмите для переворота</div>
                <Icon name="CreditCard" size={32} className="text-slate-400" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-xs mb-1">НОМЕР КАРТЫ</div>
                  <div className="text-white text-2xl font-bold tracking-wider">
                    {userData.cardNumber}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">ТЕЛЕФОН</div>
                  <div className="text-white text-lg font-semibold">{userData.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogTrigger asChild>
          <Card className="shadow-lg cursor-pointer hover-scale">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    QR-код для идентификации
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Используйте этот код для подтверждения личности
                  </p>
                  <Button variant="outline">
                    <Icon name="QrCode" size={20} className="mr-2" />
                    Показать QR-код
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR-код единой карты</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-6">
            <QRCode 
              value={`UNIFIED_CARD:${userData.id}:${userData.cardNumber}:${userData.firstName}:${userData.lastName}`} 
              size={256}
            />
            <div className="text-center">
              <p className="text-sm text-slate-600">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-xs text-slate-500 mt-1">Карта №{userData.cardNumber}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BankCardManager userId={userData.id} />
    </div>
  );
}
