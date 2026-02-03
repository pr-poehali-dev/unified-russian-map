import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для управления документами пользователей'''
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
            # Получение всех документов пользователя
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'})
                }
            
            cur.execute(
                "SELECT id, document_type, document_number, qr_code_data FROM documents WHERE user_id = %s",
                (user_id,)
            )
            docs = cur.fetchall()
            
            result = []
            for doc in docs:
                result.append({
                    'id': doc[0],
                    'type': doc[1],
                    'number': doc[2],
                    'qrCodeData': doc[3]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            # Добавление нового документа
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            doc_type = body.get('type')
            doc_number = body.get('number', '')
            
            if not all([user_id, doc_type]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId и type обязательны'})
                }
            
            # Генерация QR-кода
            qr_data = f"DOC:{doc_type}:{doc_number}:{user_id}"
            
            cur.execute(
                "INSERT INTO documents (user_id, document_type, document_number, qr_code_data) VALUES (%s, %s, %s, %s) RETURNING id",
                (user_id, doc_type, doc_number, qr_data)
            )
            doc_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': doc_id,
                    'type': doc_type,
                    'number': doc_number,
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
