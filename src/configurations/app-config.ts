import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../swagger';

export const configureApp = (app: Application) => {
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(express.static('uploads'));
  app.use(
    morgan(
      ':remote-addr :date[iso] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms',
    ),
  );

  // Initialize other configurations as needed
};
