// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors(); 
//   await app.listen(3001);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Always bind to the Render PORT
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0'); // 👈 important: bind to all interfaces

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();

