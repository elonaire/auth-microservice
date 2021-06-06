import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ACL service')
    .setDescription('ACL microservice that can be consumed as a third-party and integrated into your application, to manage your users, their roles and, their previleges.')
    .setVersion('1.0')
    .addTag('ACL')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
