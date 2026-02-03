import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onAuth: (data: { phone: string; firstName: string; lastName: string }) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && firstName && lastName) {
      onAuth({ phone, firstName, lastName });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      onAuth({ phone, firstName: 'Иван', lastName: 'Иванов' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-slate-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <Icon name="CreditCard" size={40} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-800">
            Единая карта россиянина
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Цифровая идентификация и хранение документов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Номер телефона
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-lg">
                  Войти в систему
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Номер телефона
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Имя
                  </label>
                  <Input
                    type="text"
                    placeholder="Иван"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Фамилия
                  </label>
                  <Input
                    type="text"
                    placeholder="Иванов"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-lg">
                  Зарегистрироваться
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">или</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 h-12 border-2 hover:bg-yellow-50"
            >
              <Icon name="LogIn" className="mr-2" size={20} />
              Войти через Яндекс
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
