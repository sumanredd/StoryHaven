import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PlaywrightCrawler, RequestList } = require('crawlee');

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  /** Scrape a category or search results page */
  async scrapeCategory(url: string) {
    const products: any[] = [];
    const listName = `category-list-${Date.now()}`;
    const uniqueKey = `${url}-${Date.now()}`;
    const requestList = await RequestList.open(listName, [{ url, uniqueKey }]);

    const crawler = new PlaywrightCrawler({
      requestList,
      maxConcurrency: 5,
      requestHandlerTimeoutSecs: 20,
      useSessionPool: true,
      launchContext: { launchOptions: { headless: true } },
      async requestHandler({ page, log }) {
        log.info(`Scraping category: ${url}`);

        try {
          await page.route('**/*', (route) => {
            const type = route.request().resourceType();
            if (['image', 'font', 'stylesheet'].includes(type)) route.abort();
            else route.continue();
          });

          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
          await page.waitForSelector('div.card.card--standard', { timeout: 5000 });

          const items = await page.$$eval('div.card.card--standard', (els) =>
            els.map((el) => ({
              title:
                el.querySelector('a.full-unstyled-link.product-card')?.getAttribute('data-item_name') ||
                'No title found',
              author: el.querySelector('p.author.truncate-author')?.textContent?.trim() || 'No author',
              price: el.querySelector('div.price')?.textContent?.trim() || 'No price',
              link:
                (el.querySelector('a.full-unstyled-link.product-card') as HTMLAnchorElement)?.href || 'No link',
              image: (el.querySelector('img') as HTMLImageElement)?.src || 'No image',
            }))
          );

          if (!items.length) log.warn('No products found on this page');
          products.push(...items);
        } catch (err: any) {
          log.error(`Error scraping category: ${err.message}`);
        }
      },
    });

    try {
      await crawler.run();
    } catch (err: any) {
      this.logger.error(`Category crawler failed: ${err.message}`);
    }

    return products;
  }

  /** Scrape an individual book detail page */
  async scrapeBookDetail(url: string) {
    if (!url) return { error: 'url query param is required' };

    const bookDetail: any = {};
    const listName = `book-detail-list-${Date.now()}`;
    const uniqueKey = `${url}-${Date.now()}`;
    const requestList = await RequestList.open(listName, [{ url, uniqueKey }]);

    const crawler = new PlaywrightCrawler({
      requestList,
      maxConcurrency: 1,
      requestHandlerTimeoutSecs: 20,
      useSessionPool: true,
      launchContext: { launchOptions: { headless: true } },
      async requestHandler({ page, log, request }) {
        log.info(`Scraping book detail: ${request.url}`);

        try {
          await page.route('**/*', (route) => {
            const type = route.request().resourceType();
            if (['font', 'stylesheet'].includes(type)) route.abort();
            else route.continue();
          });

          await page.goto(request.url, { waitUntil: 'domcontentloaded', timeout: 10000 });

          // --- Title ---
          const titleSelector = (await page.$('h1.product-title')) ? 'h1.product-title' : 'h1';
          await page.waitForSelector(titleSelector, { timeout: 5000 });
          bookDetail.title = await page.$eval(titleSelector, el => el.textContent?.trim()).catch(() => 'No title');

          // --- Author ---
          const authorSelector = (await page.$('span.author-item a')) ? 'span.author-item a' : 'span.author-item';
          bookDetail.author = await page.$eval(authorSelector, el => el.textContent?.trim()).catch(() => 'No author');

          // --- Price ---
          const priceSelector = (await page.$('.product-price .price')) ? '.product-price .price' : '.product-price';
          bookDetail.price = await page.$eval(priceSelector, el => el.textContent?.trim()).catch(() => 'No price');

          // --- Image ---
          const imageSelector = (await page.$('.image-magnify-none')) ? '.image-magnify-none' : 'img';
          bookDetail.image = await page.$eval(imageSelector, (el: HTMLImageElement) => el.src).catch(() => '');

          // --- Link ---
          bookDetail.link = request.url;

          // --- Description ---
          const descSelector = (await page.$('.product-description')) ? '.product-description' : '.description';
          bookDetail.description = await page.$eval(descSelector, el => el.textContent?.trim()).catch(() => '');

          // --- Panels (Summary, About, Reviews) ---
          const panels = await page.$$('.outer-accordion');
          bookDetail.aboutBook = '';
          bookDetail.aboutAuthor = '';
          bookDetail.reviews = [];

          for (const panel of panels) {
            const buttonText = await panel.$eval('button', el => el.textContent?.toLowerCase() || '').catch(() => '');
            const panelText = await panel.$eval('.panel', el => el.innerText.trim()).catch(() => '');

            if (buttonText.includes('summary')) {
              bookDetail.aboutBook = panelText;
            } else if (buttonText.includes('reviews')) {
              bookDetail.reviews = panelText
                .split(/\r?\n|\*|<br>/)
                .map(s => s.trim())
                .filter(Boolean);
            } else if (buttonText.includes('about')) {
              bookDetail.aboutAuthor = panelText;
            }
          }

          // --- Additional Info Table ---
          bookDetail.additionalInfoTable = await page.$$eval('.additional-info-table tr', rows =>
            rows
              .map(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 2) {
                  return {
                    key: cells[0].textContent?.trim() || '',
                    value: cells[1].textContent?.trim() || '',
                  };
                }
                return null;
              })
              .filter(Boolean)
          ).catch(() => []);

          // --- You Might Also Like ---
          bookDetail.youMightAlsoLike = await page.$$eval(
            '.algolia-related-products-container .main-product-card',
            (cards) =>
              cards.map((card) => {
                const linkEl = card.querySelector('a.full-unstyled-link.product-card');
                const imgEl = card.querySelector('img');
                const authorEl = card.querySelector('p.author.truncate-author');
                const priceEl = card.querySelector('.price-item');

                return {
                  title: linkEl?.textContent?.trim() || '',
                  link: linkEl instanceof HTMLAnchorElement ? linkEl.href : '',
                  image: imgEl instanceof HTMLImageElement ? imgEl.src : '',
                  author: authorEl?.textContent?.trim() || '',
                  price: priceEl?.textContent?.trim() || '',
                };
              })
          ).catch(() => []);

          const trustpilotEl = await page.$('a.trustpilot-icon');
if (trustpilotEl) {
  bookDetail.trustpilot = {
    rating: "4.6", // 🔹 static fallback until we fetch Trustpilot API
    reviews: "2,000+", // 🔹 static fallback
    link: await page.$eval('a.trustpilot-icon', el => (el as HTMLAnchorElement).href).catch(() => "")
  };
} else {
  bookDetail.trustpilot = null;
}

          log.info(`Book detail scraped successfully`);
        } catch (err: any) {
          log.error(`Error scraping book detail: ${err.message}`);
          const html = await page.content();
          log.error('Page HTML for debugging:', html);
        }
      },
    });

    try {
      await crawler.run();
    } catch (err: any) {
      this.logger.error(`Book detail crawler failed: ${err.message}`);
    }

    return bookDetail;
  }
}
