import { NestFactory } from '@nestjs/core';
import { UserMainModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserMainModule);
  await app.listen(30194);
}
bootstrap();
