import mongoose from 'mongoose'

let gfsBucket: mongoose.mongo.GridFSBucket | null = null

export function initGridFS() {
    if (mongoose.connection.db) {
        // Используем встроенный в Mongoose GridFSBucket чтобы избежать конфликтов версий BSON/mongodb
        gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        })
        console.log('GridFS Bucket инициализирован')
    } else {
        console.error('Не удалось инициализировать GridFS: соединение с базой данных не готово')
    }
}

export function getGridFSBucket(): mongoose.mongo.GridFSBucket {
    if (!gfsBucket) {
        throw new Error('GridFS Bucket еще не инициализирован')
    }
    return gfsBucket
}
