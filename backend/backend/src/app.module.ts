import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

@Module({
  imports: [],
  controllers: [AppController, ScraperController],
  providers: [AppService, ScraperService], // Make sure ScraperService is exported properly
})
export class AppModule {}

