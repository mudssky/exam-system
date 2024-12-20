import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);
  await app.listen(30193);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.startAllMicroservices();
}
bootstrap();
