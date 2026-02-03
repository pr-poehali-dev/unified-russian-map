import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';

interface Document {
  id: string;
  type: 'passport' | 'medical';
  title: string;
  number: string;
  data: Record<string, string>;
}

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAddingPassport, setIsAddingPassport] = useState(false);
  const [isAddingMedical, setIsAddingMedical] = useState(false);

  const [passportData, setPassportData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    birthDate: '',
    citizenship: 'Российская Федерация',
  });

  const [medicalNumber, setMedicalNumber] = useState('');

  const handleAddPassport = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Document = {
      id: Date.now().toString(),
      type: 'passport',
      title: 'Паспорт РФ',
      number: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      data: passportData,
    };
    setDocuments([...documents, newDoc]);
    setIsAddingPassport(false);
    setPassportData({
      lastName: '',
      firstName: '',
      middleName: '',
      email: '',
      birthDate: '',
      citizenship: 'Российская Федерация',
    });
  };

  const handleAddMedical = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicalNumber) {
      const newDoc: Document = {
        id: Date.now().toString(),
        type: 'medical',
        title: 'Медицинская карта',
        number: medicalNumber,
        data: { number: medicalNumber },
      };
      setDocuments([...documents, newDoc]);
      setIsAddingMedical(false);
      setMedicalNumber('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Мои документы</h2>
          <p className="text-slate-600 mt-1">Управление цифровыми копиями документов</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Dialog open={isAddingPassport} onOpenChange={setIsAddingPassport}>
          <DialogTrigger asChild>
            <Card className="hover-scale cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-900">
              <CardContent className="pt-6 text-center">
                <Icon name="Plus" size={48} className="mx-auto mb-3 text-blue-900" />
                <h3 className="font-semibold text-slate-800">Добавить паспорт</h3>
                <p className="text-sm text-slate-600 mt-1">Создать цифровую копию паспорта РФ</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Добавление паспорта РФ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPassport} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Фамилия</label>
                <Input
                  value={passportData.lastName}
                  onChange={(e) => setPassportData({ ...passportData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <Input
                  value={passportData.firstName}
                  onChange={(e) => setPassportData({ ...passportData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Отчество</label>
                <Input
                  value={passportData.middleName}
                  onChange={(e) => setPassportData({ ...passportData, middleName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Электронная почта</label>
                <Input
                  type="email"
                  value={passportData.email}
                  onChange={(e) => setPassportData({ ...passportData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата рождения</label>
                <Input
                  type="date"
                  value={passportData.birthDate}
                  onChange={(e) => setPassportData({ ...passportData, birthDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Гражданство</label>
                <Input
                  value={passportData.citizenship}
                  onChange={(e) => setPassportData({ ...passportData, citizenship: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Создать документ
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingMedical} onOpenChange={setIsAddingMedical}>
          <DialogTrigger asChild>
            <Card className="hover-scale cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-900">
              <CardContent className="pt-6 text-center">
                <Icon name="Plus" size={48} className="mx-auto mb-3 text-blue-900" />
                <h3 className="font-semibold text-slate-800">Добавить медкарту</h3>
                <p className="text-sm text-slate-600 mt-1">Привязать медицинскую карту по номеру</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавление медицинской карты</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMedical} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер медицинской карты</label>
                <Input
                  placeholder="Введите номер карты"
                  value={medicalNumber}
                  onChange={(e) => setMedicalNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">
                  Укажите номер, указанный в вашей медицинской карте
                </p>
              </div>
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                Добавить карту
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Добавленные документы</h3>
          {documents.map((doc) => (
            <Card key={doc.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon
                      name={doc.type === 'passport' ? 'FileText' : 'Heart'}
                      size={24}
                      className="text-blue-900"
                    />
                    <span>{doc.title}</span>
                  </div>
                  <span className="text-sm font-normal text-slate-600">№ {doc.number}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {doc.type === 'passport' ? (
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-600">ФИО:</span>
                            <div className="font-medium">
                              {doc.data.lastName} {doc.data.firstName} {doc.data.middleName}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-600">Дата рождения:</span>
                            <div className="font-medium">{doc.data.birthDate}</div>
                          </div>
                          <div>
                            <span className="text-slate-600">Email:</span>
                            <div className="font-medium">{doc.data.email}</div>
                          </div>
                          <div>
                            <span className="text-slate-600">Гражданство:</span>
                            <div className="font-medium">{doc.data.citizenship}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <span className="text-slate-600">Номер медицинской карты:</span>
                        <div className="font-medium">{doc.data.number}</div>
                      </div>
                    )}
                  </div>
                  <div className="ml-8">
                    <QRCode value={`DOC:${doc.type}:${doc.number}`} size={120} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
