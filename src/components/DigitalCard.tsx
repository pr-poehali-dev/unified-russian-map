import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';

interface DigitalCardProps {
  userData: {
    phone: string;
    firstName: string;
    lastName: string;
  };
}

export default function DigitalCard({ userData }: DigitalCardProps) {
  const cardNumber = '1234 5678 9012 3456';
  const issueDate = new Date().toLocaleDateString('ru-RU');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
              <div className="text-white text-2xl font-bold tracking-wider">
                {cardNumber}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-blue-200 text-xs mb-1">ВЛАДЕЛЕЦ КАРТЫ</div>
              <div className="text-white text-lg font-semibold">
                {userData.firstName} {userData.lastName}
              </div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">ТЕЛЕФОН</div>
              <div className="text-white text-lg font-semibold">{userData.phone}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
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

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                QR-код для идентификации
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Используйте этот код для подтверждения личности в государственных учреждениях
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Icon name="ShieldCheck" size={16} className="text-green-600" />
                <span>Защищено криптографической подписью</span>
              </div>
            </div>
            <div className="ml-8">
              <QRCode value={`CARD:${cardNumber}:${userData.firstName}:${userData.lastName}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-scale cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Icon name="UserCheck" size={40} className="mx-auto mb-3 text-blue-900" />
            <h4 className="font-semibold text-slate-800">Личные данные</h4>
            <p className="text-sm text-slate-600 mt-1">Просмотр и редактирование</p>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Icon name="History" size={40} className="mx-auto mb-3 text-blue-900" />
            <h4 className="font-semibold text-slate-800">История операций</h4>
            <p className="text-sm text-slate-600 mt-1">Все действия с картой</p>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Icon name="Settings" size={40} className="mx-auto mb-3 text-blue-900" />
            <h4 className="font-semibold text-slate-800">Настройки</h4>
            <p className="text-sm text-slate-600 mt-1">Безопасность и уведомления</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
