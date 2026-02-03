import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для аутентификации пользователей по номеру телефона'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            # Регистрация или вход
            body = json.loads(event.get('body', '{}'))
            phone = body.get('phone', '').strip()
            first_name = body.get('firstName', '').strip()
            last_name = body.get('lastName', '').strip()
            
            if not phone or not first_name or not last_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Все поля обязательны'})
                }
            
            # Генерация номера единой карты
            card_number = f"7810{phone[-10:]}"[:16]
            
            # Проверка существования пользователя
            cur.execute("SELECT id, phone, first_name, last_name, card_number FROM users WHERE phone = %s", (phone,))
            user = cur.fetchone()
            
            if user:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': user[0],
                        'phone': user[1],
                        'firstName': user[2],
                        'lastName': user[3],
                        'cardNumber': user[4]
                    })
                }
            else:
                # Создание нового пользователя
                cur.execute(
                    "INSERT INTO users (phone, first_name, last_name, card_number) VALUES (%s, %s, %s, %s) RETURNING id",
                    (phone, first_name, last_name, card_number)
                )
                user_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': user_id,
                        'phone': phone,
                        'firstName': first_name,
                        'lastName': last_name,
                        'cardNumber': card_number
                    })
                }
        
        elif method == 'PUT':
            # Обновление данных пользователя
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            first_name = body.get('firstName')
            last_name = body.get('lastName')
            phone = body.get('phone')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'})
                }
            
            cur.execute(
                "UPDATE users SET first_name = %s, last_name = %s, phone = %s, updated_at = %s WHERE id = %s",
                (first_name, last_name, phone, datetime.now(), user_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    finally:
        cur.close()
        conn.close()
