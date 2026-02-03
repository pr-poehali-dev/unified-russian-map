import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';
import { useToast } from '@/hooks/use-toast';

interface BankCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  qrCodeData: string;
}

interface BankCardManagerProps {
  userId: number;
}

export default function BankCardManager({ userId }: BankCardManagerProps) {
  const [cards, setCards] = useState<BankCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);
  const { toast } = useToast();

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cardHolder: ''
  });

  const loadCards = async () => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/42e8b651-0f17-404c-9ea5-6e921c1f19c9?userId=${userId}`
      );
      const data = await response.json();
      if (response.ok) {
        setCards(data);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  useEffect(() => {
    loadCards();
  }, [userId]);

  const handleAddCard = async () => {
    if (!newCard.cardNumber || !newCard.expiryDate) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/42e8b651-0f17-404c-9ea5-6e921c1f19c9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cardNumber: newCard.cardNumber.replace(/\s/g, ''),
          expiryDate: newCard.expiryDate,
          cardHolder: newCard.cardHolder
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Карта добавлена'
        });
        setShowAddDialog(false);
        setNewCard({ cardNumber: '', expiryDate: '', cardHolder: '' });
        loadCards();
      } else {
        throw new Error('Failed to add card');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить карту',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Банковские карты</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-900 hover:bg-blue-800">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить карту
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить банковскую карту</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер карты *</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })
                  }
                  maxLength={19}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Срок действия *</label>
                <Input
                  placeholder="MM/YY"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Держатель карты</label>
                <Input
                  placeholder="IVAN IVANOV"
                  value={newCard.cardHolder}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardHolder: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <Button onClick={handleAddCard} className="w-full" disabled={loading}>
                {loading ? 'Добавление...' : 'Добавить карту'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="hover-scale cursor-pointer" onClick={() => setSelectedCard(card)}>
            <CardHeader>
              <CardTitle className="text-lg">
                <Icon name="CreditCard" size={20} className="inline mr-2" />
                •••• {card.cardNumber.slice(-4)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Срок действия:</span>
                  <span className="font-medium">{card.expiryDate}</span>
                </div>
                {card.cardHolder && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Держатель:</span>
                    <span className="font-medium">{card.cardHolder}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR-код карты</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="flex flex-col items-center space-y-4 py-6">
              <QRCode value={selectedCard.qrCodeData} size={256} />
              <div className="text-center">
                <p className="text-sm font-medium">•••• {selectedCard.cardNumber.slice(-4)}</p>
                <p className="text-xs text-slate-500 mt-1">Срок: {selectedCard.expiryDate}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
