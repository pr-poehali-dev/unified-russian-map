import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для управления банковскими картами пользователей'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            # Получение всех карт пользователя
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'})
                }
            
            cur.execute(
                "SELECT id, card_number, expiry_date, card_holder, qr_code_data FROM bank_cards WHERE user_id = %s",
                (user_id,)
            )
            cards = cur.fetchall()
            
            result = []
            for card in cards:
                result.append({
                    'id': card[0],
                    'cardNumber': card[1],
                    'expiryDate': card[2],
                    'cardHolder': card[3],
                    'qrCodeData': card[4]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            # Добавление новой карты
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            card_number = body.get('cardNumber', '').replace(' ', '')
            expiry_date = body.get('expiryDate', '')
            card_holder = body.get('cardHolder', '')
            
            if not all([user_id, card_number, expiry_date]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Все поля обязательны'})
                }
            
            # Генерация QR-кода
            qr_data = f"CARD:{card_number}:{expiry_date}"
            
            cur.execute(
                "INSERT INTO bank_cards (user_id, card_number, expiry_date, card_holder, qr_code_data) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (user_id, card_number, expiry_date, card_holder, qr_data)
            )
            card_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': card_id,
                    'cardNumber': card_number,
                    'expiryDate': expiry_date,
                    'cardHolder': card_holder,
                    'qrCodeData': qr_data
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    finally:
        cur.close()
        conn.close()
