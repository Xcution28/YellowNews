import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'YellowNews API',
            version: '1.0.0',
            description: 'API документация для платформы YellowNews'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'] // Пути к файлам с аннотациями
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express): void => {
    app.use(
        '/swagger',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customSiteTitle: 'YellowNews API Docs'
        })
    )
}
