import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import type { UserData } from '@/App';

interface ProfileSectionProps {
  userData: UserData;
  onUpdate: (data: UserData) => void;
  onLogout: () => void;
}

export default function ProfileSection({ userData, onUpdate, onLogout }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/70edf40e-d5b6-4019-a871-56ea66de4f61', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
      });

      if (response.ok) {
        onUpdate({
          ...userData,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        });
        setIsEditing(false);
        toast({
          title: 'Успешно',
          description: 'Данные обновлены'
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    toast({
      title: 'Функция в разработке',
      description: 'Удаление аккаунта будет доступно в следующей версии'
    });
    setShowDeleteDialog(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Icon name="User" size={24} className="text-blue-900" />
            <span>Личные данные</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Имя:</span>
                  <span className="font-medium">{userData.firstName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Фамилия:</span>
                  <span className="font-medium">{userData.lastName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Телефон:</span>
                  <span className="font-medium">{userData.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-600">Номер карты:</span>
                  <span className="font-medium font-mono">{userData.cardNumber}</span>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-900 hover:bg-blue-800">
                <Icon name="Edit" size={20} className="mr-2" />
                Редактировать данные
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Имя</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Фамилия</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Телефон</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1 bg-blue-900 hover:bg-blue-800" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Отмена
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Icon name="Shield" size={24} className="text-blue-900" />
            <span>Безопасность</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="ShieldCheck" size={24} className="text-green-600" />
                <div>
                  <p className="font-medium">Двухфакторная аутентификация</p>
                  <p className="text-sm text-slate-600">Включена через SMS</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Lock" size={24} className="text-blue-600" />
                <div>
                  <p className="font-medium">Шифрование данных</p>
                  <p className="text-sm text-slate-600">Все данные защищены</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-red-700">
            <Icon name="AlertTriangle" size={24} />
            <span>Опасная зона</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Удаление аккаунта необратимо. Все ваши данные, документы и карты будут удалены навсегда.
          </p>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Icon name="Trash2" size={20} className="mr-2" />
                Удалить аккаунт
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Удалить аккаунт?</DialogTitle>
                <DialogDescription>
                  Это действие нельзя отменить. Все ваши данные будут удалены безвозвратно.
                </DialogDescription>
              </DialogHeader>
              <div className="flex space-x-2">
                <Button onClick={handleDelete} variant="destructive" className="flex-1">
                  Удалить навсегда
                </Button>
                <Button onClick={() => setShowDeleteDialog(false)} variant="outline" className="flex-1">
                  Отмена
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
