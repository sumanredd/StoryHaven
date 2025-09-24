import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scrape')
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  @Get('search')
  async search(@Query('q') keyword: string) {
    console.log('Received search query:', keyword); // <-- Add this
    if (!keyword) return { error: 'q query param is required' };

    const url = `https://www.worldofbooks.com/en-gb/search?q=${encodeURIComponent(keyword)}`;
    return { products: await this.scraper.scrapeCategory(url) };
  }

  @Get('category')
  async category(@Query('url') url: string) {
    if (!url) return { error: 'url query param is required' };
    return { products: await this.scraper.scrapeCategory(url) };
  }

  @Get('book-detail')
  async bookDetail(@Query('url') url: string) {
    if (!url) return { error: 'url query param is required' };
    const detail = await this.scraper.scrapeBookDetail(url);
    return detail || { error: 'Book detail not found' };
  }
}
