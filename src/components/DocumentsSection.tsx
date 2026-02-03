import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: number;
  type: string;
  number: string;
  qrCodeData: string;
}

interface DocumentsSectionProps {
  userId: number;
}

export default function DocumentsSection({ userId }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [docType, setDocType] = useState('passport');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadDocuments = async () => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/f15530bf-43c2-4f3d-8aaa-f9c5d0674924?userId=${userId}`
      );
      const data = await response.json();
      if (response.ok) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  const handleAddDocument = async () => {
    if (!docNumber) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер документа',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f15530bf-43c2-4f3d-8aaa-f9c5d0674924', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: docType,
          number: docNumber
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Документ добавлен'
        });
        setShowAddDialog(false);
        setDocNumber('');
        loadDocuments();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить документ',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport':
        return 'FileText';
      case 'medical':
        return 'Heart';
      default:
        return 'File';
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'passport':
        return 'Паспорт РФ';
      case 'medical':
        return 'Медицинская карта';
      default:
        return 'Документ';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Мои документы</h2>
          <p className="text-slate-600 mt-1">Управление цифровыми копиями документов</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-900 hover:bg-blue-800">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить документ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить документ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип документа</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-slate-300"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="passport">Паспорт РФ</option>
                  <option value="medical">Медицинская карта</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер документа</label>
                <Input
                  placeholder="Введите номер"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />
              </div>
              <Button onClick={handleAddDocument} className="w-full" disabled={loading}>
                {loading ? 'Добавление...' : 'Добавить'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card 
            key={doc.id} 
            className="hover-scale cursor-pointer"
            onClick={() => setSelectedDoc(doc)}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Icon name={getDocumentIcon(doc.type)} size={24} className="text-blue-900" />
                <span>{getDocumentTitle(doc.type)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Номер:</span>
                  <span className="font-medium">{doc.number}</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Icon name="QrCode" size={16} className="mr-2" />
                  Показать QR-код
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR-код документа</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="flex flex-col items-center space-y-4 py-6">
              <QRCode value={selectedDoc.qrCodeData} size={256} />
              <div className="text-center">
                <p className="text-sm font-medium">{getDocumentTitle(selectedDoc.type)}</p>
                <p className="text-xs text-slate-500 mt-1">№ {selectedDoc.number}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
